package main.java.mysite.streaming;

import com.mongodb.BasicDBObject;
import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class MongoTest {

	public static final Document DOCUMENT = new Document("name", "a");
	MongoClient mongo;
	MongoCollection<Document> col;

  @Before
	public void setup(){
		mongo = new MongoClient("localhost",27017);
		MongoDatabase db = mongo.getDatabase("test");
		col = db.getCollection("myCollection");
	}

	@Test
	public void mongoInsertsAndRemovesCorrectly(){
		//run
		insertOne();

		//assert no error

		//clean
		purgeCollection();
	}

	@Test
	public void mongoReadsCorrectly(){
		//setup
		insertOne();

		//run
		FindIterable<Document> doc = col.find(Filters.eq("name", "a"));
		String retrievedJson = doc.first().toJson();

		//assert
		Assert.assertEquals(DOCUMENT.toJson(),retrievedJson);

		//clean
		purgeCollection();
	}

	@Test
	public void mongoUpdatesCorrectly(){
		//setup
		FindOneAndUpdateOptions fo = new FindOneAndUpdateOptions();
		fo.upsert(true);

		Document updateDoc = new Document("name","abc");
		Document myDoc = col.findOneAndUpdate(Filters.eq("name", "a"),
						new Document("$set", updateDoc), fo);
		String expectedName = updateDoc.getString("name");

		//run
		FindIterable<Document> doc = col.find(Filters.eq("name", "abc"));
		String retrievedName = doc.first().getString("name");

		//assert
		Assert.assertEquals(expectedName, retrievedName);

		//clean
		purgeCollection();
	}

	@After
	public void shutDown(){
		purgeCollection();
		mongo.close();
	}

	public void insertOne(){
		col.insertOne(DOCUMENT.append("value", 2));
	}

	public void purgeCollection(){
		col.deleteMany(new BasicDBObject());
	}

}
