package main.java.mysite.accessor;

import com.google.common.base.Preconditions;
import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import org.bson.Document;

import java.io.Serializable;

public class MongoAccessor implements Serializable{

  private MongoClient client;
  private MongoDatabase mongoDB;
  private MongoCollection<Document> mongoCollection;

  public MongoAccessor() {
    try {
      client = new MongoClient("localhost",27017);
    } catch (Exception e) {
      //TODO Log it.
    }
  }

  public MongoAccessor(String db, String col) {
    try {
      client = new MongoClient("localhost",27017);
      mongoDB = client.getDatabase("test");
      mongoCollection = mongoDB.getCollection("myCollection");
    } catch (Exception e) {
      //TODO Log it.
    }
  }

  public MongoClient getClient() {
    if (client == null) {
      throw new RuntimeException();
    }
    return client;
  }

  public void upsert(Document doc) {
    Preconditions.checkNotNull(mongoCollection);

    FindOneAndUpdateOptions fo = new FindOneAndUpdateOptions();
    fo.upsert(true);

    int prevCount = 0;
    FindIterable<Document> toReplaceDoc = mongoCollection.find(Filters.eq("name", doc.get("name")));

    for(Document docMatched : toReplaceDoc){
      prevCount = docMatched.getInteger("count", 0);
    }

    mongoCollection.findOneAndUpdate(Filters.eq("name", doc.get("name")),
            new Document("$set", new Document("count",doc.getInteger("count",0)+prevCount)
                    .append("name", doc.get("name"))), fo);
  }

}
