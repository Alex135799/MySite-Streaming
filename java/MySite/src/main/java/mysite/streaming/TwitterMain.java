package main.java.mysite.streaming;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import main.java.mysite.accessor.MongoAccessor;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
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

import scala.Tuple2;
import twitter4j.Status;

public class TwitterMain {
	static final String CONSUMER_KEY = "jwMxOrJC0zY3P4Vo3HDyPp2Rg";
	static final String CONSUMER_SECRET = "w8ajSJQla38cjc09muvIzQ4BExpKP16Z7yzktrQbikFcnfYEca";
	static final String ACCESS_TOKEN = "2536527730-dqSFa7CKo1ykvFlyGrfvcMq2J3Uio8xIrOfjHlx";
	static final String ACCESS_TOKEN_SECRET = "kEXyie4WG5X2B1viVm2jhod7niSqjXp7e38omLxFfAzQz";
	static final Duration SLIDE_DURATION = new Duration(1 * 1000);
	static final Duration WINDOW_DURATION = new Duration(1 * 1000);
	static final Duration CONTEXT_DURATION = new Duration(1 * 1000);
	static final long STREAM_TIMEOUT = ((long) (60 * 1000));

	public static void main(String[] args) {

		JavaStreamingContext sctx = setup();
		MongoAccessor mongoAccessor = new MongoAccessor("test", "myCollection");

		JavaDStream<Status> twitterStream = TwitterUtils.createStream(sctx);

		//Convert Status to flat hashtag Strings
		JavaDStream<String> hashtagText = twitterStream.flatMap(x -> getHashTags(x).iterator());

		//Count hashtags
		//first Duration: size of window to reduce, second Duration: how often to execute
		JavaPairDStream<String, Long> hashtagTextMap = hashtagText.countByValueAndWindow(WINDOW_DURATION, SLIDE_DURATION);

		//Make the count the Key
		JavaPairDStream<Long, String> hashtagCountMap = hashtagTextMap.mapToPair(x -> x.swap());

		//Sort by count
		hashtagCountMap = hashtagCountMap.transformToPair(x -> x.sortByKey(false));
		hashtagCountMap.print();
		
		//TODO: Facebook
		//https://developers.facebook.com/docs/javascript/quickstart

		storeTopHashtags(hashtagCountMap, mongoAccessor);
		
		sctx.start();
		try {
			sctx.awaitTerminationOrTimeout(STREAM_TIMEOUT);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

	private static void storeTopHashtags(JavaPairDStream<Long, String> hashtagCountMap, MongoAccessor mongoAccessor) {

		hashtagCountMap.foreachRDD( (JavaPairRDD<Long,String> rdd) -> {
			rdd.foreachPartition( list -> {
				list.forEachRemaining(pair -> {
					if(CharMatcher.ASCII.matchesAllOf(pair._2)){
						Document javadoc;
						try{
							javadoc = Document.parse("{name: \""+pair._2+"\",count: "+pair._1+"}");
						}catch(JsonParseException err){
							javadoc = Document.parse("{name: \"JsonError\",count:0}");
						}
						if((int)javadoc.get("count") > 0){
							mongoAccessor.upsert(javadoc);
						}
					}
				});
				System.out.println("SAVED");
			});
		});

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

	public static JavaStreamingContext setup(){
		System.setProperty("twitter4j.oauth.consumerKey", CONSUMER_KEY);
		System.setProperty("twitter4j.oauth.consumerSecret", CONSUMER_SECRET);
		System.setProperty("twitter4j.oauth.accessToken", ACCESS_TOKEN);
		System.setProperty("twitter4j.oauth.ACCESS_TOKEN_SECRET", ACCESS_TOKEN_SECRET);
		String user = "Alex";

		SparkConf conf = new SparkConf().setAppName("Top Hash Tags");
		conf.setMaster("local[3]");
		conf.set("spark.driver.host", "127.0.0.1");
		conf.set("spark.driver.port", "1234");
		conf.set("spark.mongodb.input.uri", "mongodb://127.0.0.1/test.myCollection?readPreference=primaryPreferred");
		conf.set("spark.mongodb.output.uri", "mongodb://127.0.0.1/test.myCollection");
		JavaSparkContext ctx = new JavaSparkContext(conf);
		JavaStreamingContext sctx = new JavaStreamingContext(ctx, CONTEXT_DURATION);
		sctx.checkpoint("file:///home/"+user+"/TwitterCheckpoint");

		return sctx;
	}
}
