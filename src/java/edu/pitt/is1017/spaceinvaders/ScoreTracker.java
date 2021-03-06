package edu.pitt.is1017.spaceinvaders;

import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import edu.pitt.utilities.DbUtilities;

/**
 * Class for logging partial and complete score values to database
 * @author Logan Gordon
 */
public class ScoreTracker {
	public static ScoreTracker scoreTracker;
	
	private User user;
	private int currentScore;
	private int highestScore;
	private String gameID;
	
	public int getCurrentScore(){
		return this.currentScore;
	}
	public int getHighestScore(){
		return this.highestScore;
	}
	
        /**
         * Each ScoreTracker will log scores for a unique Gmae ID
         * @param user The User that will be credited in the database
         * @throws Exception 
         */
	public ScoreTracker(User user) throws Exception{
		if(!user.isLoggedIn()){
			throw new Exception("User is not logged in");
		}
		this.user = user;
		this.currentScore = 0;
		this.gameID = UUID.randomUUID().toString();
		
		DbUtilities db = new DbUtilities();
		StringBuilder query = new StringBuilder(300);
		query.append("SELECT MAX(scoreValue) as `maxScore` FROM finalscores ");
		query.append("WHERE fk_userID = '" + user.getUserID() + "'; ");
		ResultSet rs = db.getResultSet(query.toString());
		try{
			if(rs.next()){
				this.highestScore = rs.getInt("maxScore");
			} else {
				this.highestScore = 0;
			}
			db.closeConnection();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
        /**
         * Records a single hit or miss to the database
         * @param point 1 for hit, -1 for miss
         */
	public void recordScore(int point){
		this.currentScore += point;
		DbUtilities db = new DbUtilities();
		StringBuilder query = new StringBuilder(300);
		query.append("INSERT INTO runningscores ");
		query.append("(gameID,scoreType,scoreValue,fk_userID,dateTimeEntered) ");
		query.append("VALUES ('" + this.gameID + "', ");
		query.append("b'" + (point==1? "1" : "0") + "', ");
		query.append("'" + this.currentScore + "', ");
		query.append("'" + this.user.getUserID() + "', ");
		query.append("'" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()) + "');");
		try {
			db.executeQuery(query.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
        /**
         * Records final score to the database when the game has ended
         */
	public void recordFinalScore(){
		if(currentScore > highestScore){
			highestScore = currentScore;
		}
		
		DbUtilities db = new DbUtilities();
		StringBuilder query = new StringBuilder(300);
		query.append("INSERT INTO finalscores ");
		query.append("(gameID,scoreValue,fk_userID,dateTimeEntered) ");
		query.append("VALUES ('" + this.gameID + "', ");
		query.append("'" + this.currentScore + "', ");
		query.append("'" + this.user.getUserID() + "', ");
		query.append("'" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()) + "');");
		try{
			db.executeQuery(query.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
