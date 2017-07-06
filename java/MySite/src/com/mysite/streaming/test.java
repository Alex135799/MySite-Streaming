package com.mysite.streaming;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.FindOneAndUpdateOptions;

public class test {

	public static void main(String[] args){
		MongoClient mongo = new MongoClient("ocalhost",27017);
	    MongoDatabase db = mongo.getDatabase("test");
	    MongoCollection<Document> col = db.getCollection("myCollection");
	    
	    col.insertOne(new Document("name", "a")
	    				.append("value", 2));
	    
	    FindIterable<Document> firstDoc = col.find(Filters.eq("name", "a"));
	    
	    for(Document doc : firstDoc){
	    	System.out.println(doc.toJson());
	    }
	    
	    FindOneAndUpdateOptions fo = new FindOneAndUpdateOptions();
	    fo.upsert(true);
	    
	    Document myDoc = col.findOneAndUpdate(Filters.eq("name", "a"), new Document("$set", new Document("name","abc")), fo);
	    
	    System.out.println(myDoc.toJson());
	    
	    FindIterable<Document> secondDoc = col.find(Filters.eq("name", "abc"));
	    
	    for(Document doc : secondDoc){
	    	System.out.println(doc.toJson());
	    }
	    
	    mongo.close();
	}

}
