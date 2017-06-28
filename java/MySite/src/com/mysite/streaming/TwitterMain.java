package com.mysite.streaming;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.PairFunction;
import org.apache.spark.streaming.Duration;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaPairDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.streaming.twitter.TwitterUtils;
import org.bson.Document;
import org.bson.json.JsonParseException;

import com.google.common.base.CharMatcher;
import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.spark.MongoSpark;
import com.mongodb.spark.config.ReadConfig;
import com.mongodb.spark.config.WriteConfig;

import scala.Tuple2;
import twitter4j.Status;

public class TwitterMain {
	final static String consumerKey = "jwMxOrJC0zY3P4Vo3HDyPp2Rg";
	final static String consumerSecret = "w8ajSJQla38cjc09muvIzQ4BExpKP16Z7yzktrQbikFcnfYEca";
	final static String accessToken = "2536527730-dqSFa7CKo1ykvFlyGrfvcMq2J3Uio8xIrOfjHlx";
	final static String accessTokenSecret = "kEXyie4WG5X2B1viVm2jhod7niSqjXp7e38omLxFfAzQz";
	
	public static void main(String[] args) {
		System.setProperty("twitter4j.oauth.consumerKey", consumerKey);
	    System.setProperty("twitter4j.oauth.consumerSecret", consumerSecret);
	    System.setProperty("twitter4j.oauth.accessToken", accessToken);
	    System.setProperty("twitter4j.oauth.accessTokenSecret", accessTokenSecret);
	    System.setProperty("twitter4j.http.proxyHost", "www-proxy");
	    System.setProperty("twitter4j.http.proxyPort", "80");
	    System.setProperty("twitter4j.http.proxyUser", "n0252056");
	    System.setProperty("twitter4j.http.proxyPassword", "9BioChem");
	    //String user = "Alex";
	    String user = "n0252056";
	    
		SparkConf conf = new SparkConf().setAppName("Top Hash Tags");
		conf.setMaster("local[2]");
		conf.set("spark.driver.host", "127.0.0.1");
		conf.set("spark.driver.port", "1234");
		conf.set("spark.mongodb.input.uri", "mongodb://127.0.0.1/test.myCollection?readPreference=primaryPreferred");
		//conf.set("spark.mongodb.input.uri", "mongodb://127.0.0.1/test.myCollection");
		conf.set("spark.mongodb.output.uri", "mongodb://127.0.0.1/test.myCollection");
		JavaSparkContext ctx = new JavaSparkContext(conf);
		JavaStreamingContext sctx = new JavaStreamingContext(ctx, new Duration(5 * 1000));
		sctx.checkpoint("file:///home/"+user+"/TwitterCheckpoint");
		//sctx.checkpoint("hdfs:///user/n0252056/TwitterCheckpoint");
		
		JavaDStream<Status> twitterStream = TwitterUtils.createStream(sctx);
		
		//Convert Status to flat hashtag Strings
		JavaDStream<String> hashtagText = twitterStream.flatMap(new FlatMapFunction<Status, String>(){
			private static final long serialVersionUID = 1L;

			@Override
			public Iterator<String> call(Status x){
				return getHashTags(x).iterator();
			}
		});
		//Count hashtags
		//first Duration: size of window to reduce, second Duration: how often to execute
		JavaPairDStream<String, Long> hashtagTextMap = hashtagText.countByValueAndWindow(new Duration(15 * 1000), new Duration(10 * 1000));
		//Make the count the Key
		JavaPairDStream<Long, String> hashtagCountMap = hashtagTextMap.mapToPair(new PairFunction<Tuple2<String, Long>, Long, String>(){
			private static final long serialVersionUID = 1L;

			@Override
			public Tuple2<Long, String> call(Tuple2<String, Long> x){
				return x.swap();
			}
		});
		//Sort by count
		hashtagCountMap = hashtagCountMap.transformToPair(new Function<JavaPairRDD<Long, String>, JavaPairRDD<Long, String>>(){
			private static final long serialVersionUID = 1L;

			@Override
			public JavaPairRDD<Long, String> call(JavaPairRDD<Long, String> x){
				return x.sortByKey(false);
			}
		});
		hashtagCountMap.print();
		
		/*Map<String, String> readOverrides = new HashMap<String, String>();
		readOverrides.put("collection", "myCollection");
		readOverrides.put("readPreference.name", "secondaryPreferred");
		ReadConfig readConfig = ReadConfig.create(ctx).withOptions(readOverrides);
		JavaRDD<Document> readRDD = MongoSpark.load(ctx,readConfig);
		System.out.println("READ:");
		readRDD.collect().forEach(doc -> System.out.println(doc));*/
		
		//TODO: Facebook
		//https://developers.facebook.com/docs/javascript/quickstart
		
		
		hashtagCountMap.foreachRDD( (JavaPairRDD<Long,String> rdd) -> {
			System.out.println("NEW RDD");
			rdd = rdd.filter( pair -> CharMatcher.ASCII.matchesAllOf(pair._2));
			JavaRDD<Document> javadoc = rdd.map( pair -> {
				try{
					return Document.parse("{name: \""+pair._2+"\",count: "+pair._1+"}");
				}catch(JsonParseException err){
					return Document.parse("{name: \"JsonError\",count:0}");
				}
			});
			MongoClient mongo = new MongoClient("localhost",27017);
		    MongoDatabase db = mongo.getDatabase("test");
		    MongoCollection<Document> col = db.getCollection("myCollection");
		    
			javadoc = javadoc.filter( doc -> (int)doc.get("count") > 0);
			javadoc.takeSample(false, 10).forEach( doc -> System.out.println(doc));
			mongoUpsert(javadoc, ctx, col);
			System.out.println("SAVED");
			mongo.close();
		});
		
		sctx.start();
		try {
			sctx.awaitTerminationOrTimeout((long) (60 * 1000));
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	private static void mongoUpsert(JavaRDD<Document> javadoc, JavaSparkContext ctx, MongoCollection<Document> col) {
		/*Map<String, String> writeOverrides = new HashMap<String, String>();
		writeOverrides.put("collection", "myCollection");
		writeOverrides.put("writeConcern.w", "majority");
		WriteConfig writeConf = WriteConfig.create(ctx).withOptions(writeOverrides);
		
		Map<String, String> readOverrides = new HashMap<String, String>();
	    readOverrides.put("collection", "spark");
	    readOverrides.put("readPreference.name", "secondaryPreferred");
	    ReadConfig readConfig = ReadConfig.create(ctx).withOptions(readOverrides);*/
	    
	    FindOneAndUpdateOptions fo = new FindOneAndUpdateOptions();
	    fo.upsert(true);
	    
	    javadoc.foreachAsync( (Document doc) -> {
	    	
	    	int prevCount = 0;
		    FindIterable<Document> toReplaceDoc = col.find(Filters.eq("name", doc.get("name")));
		    
		    for(Document docMatched : toReplaceDoc){
		    	prevCount = docMatched.getInteger("count", 0);
		    }
	    	
	    	col.findOneAndUpdate(Filters.eq("name", doc.get("name")), 
	    			new Document("$set", new Document("count",doc.getInteger("count",0)+prevCount)), fo);
	    	
	    } );
		
	}

	public static ArrayList<String> getHashTags(Status status){
		Pattern MY_PATTERN = Pattern.compile("#(\\S+)");
		Matcher mat = MY_PATTERN.matcher(status.getText());
		ArrayList<String> strs=new ArrayList<String>();
		while (mat.find()) {
		  //System.out.println(mat.group(1));
		  strs.add(mat.group(1));
		}
		return strs;
	}
}
