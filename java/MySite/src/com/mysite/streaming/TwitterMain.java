package com.mysite.streaming;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
	    System.setProperty("twitter4j.http.proxyPassword", "6BioChem");
	    
		SparkConf conf = new SparkConf().setAppName("Top Hash Tags");
		conf.setMaster("local[*]");
		JavaSparkContext ctx = new JavaSparkContext(conf);
		JavaStreamingContext sctx = new JavaStreamingContext(ctx, new Duration(5 * 1000));
		sctx.checkpoint("file:///home/n0252056/TwitterCheckpoint");
		//sctx.checkpoint("hdfs:///user/n0252056/TwitterCheckpoint");
		
		JavaDStream<Status> twitterStream = TwitterUtils.createStream(sctx);
		
		//Convert Status to flat hashtag Strings
		JavaDStream<String> hashtagText = twitterStream.flatMap(new FlatMapFunction<Status, String>(){
			private static final long serialVersionUID = 1L;

			@Override
			public ArrayList<String> call(Status x){
				return getHashTags(x);
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
		/*hashtagCountMap.foreachRDD( (JavaPairRDD<Long,String> rdd) -> {
			System.out.println("NEW RDD");
			List<Tuple2<Long, String>> list = rdd.collect();
			for(Tuple2<Long, String> tup : list){
				System.out.println(tup._2+" : "+tup._1);
			}
		});*/
		/*JavaPairRDD<Long, String> hashtagCountMapRDD = hashtagCountMap.compute(new Time(15*1000));
		List<Tuple2<Long, String>> hashtagCountMapList = hashtagCountMapRDD.collect();
		for(Tuple2<Long, String> hashtagCountMapT : hashtagCountMapList){
			System.out.println(hashtagCountMapT);
		}*/
		
		sctx.start();
		sctx.awaitTerminationOrTimeout((long) (60 * 1000));
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
