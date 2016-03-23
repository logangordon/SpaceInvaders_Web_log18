package edu.pitt.is1017.spaceinvaders;

import edu.pitt.utilities.DbUtilities;
import java.lang.StringBuilder;
import java.sql.ResultSet;

public class User {
	private int userID;
	private String lastName;
	private String firstName;
	private String email;
	private String password;
	private boolean loggedIn = false;
	
	public int getUserID() {
		return userID;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public boolean isLoggedIn() {
		return loggedIn;
	}
	public void setLoggedIn(boolean loggedIn) {
		this.loggedIn = loggedIn;
	}

	public User(int userID){
		DbUtilities db = new DbUtilities();
		StringBuilder query = new StringBuilder(250);
		query.append("SELECT lastName, firstName, email ");
		query.append("FROM users ");
		query.append("WHERE userID = '" + Integer.toString(userID) + "'; ");
		ResultSet user = db.getResultSet(query.toString());
		try{
			user.next();
			this.userID = userID;
			this.lastName = user.getString("lastName");
			this.firstName = user.getString("firstName");
			this.email = user.getString("email");
			this.loggedIn = true;
			db.closeConnection();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public User(String email, String password){
		DbUtilities db = new DbUtilities();
		StringBuilder query = new StringBuilder(100);
		query.append("SELECT lastName, firstName, userID ");
		query.append("FROM users ");
		query.append("WHERE email = '"+ email + "' ");
		query.append("AND password = MD5('" + password + "'); ");
		ResultSet user = db.getResultSet(query.toString());
		try{
			if(user.next()){
				this.userID = user.getInt("userID");
				this.lastName = user.getString("lastName");
				this.firstName = user.getString("firstName");
				this.email = email;
				this.password = password;
				this.loggedIn = true;
				db.closeConnection();
			} else {
				this.loggedIn = false;
				db.closeConnection();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public User(String lastName, String firstName, String email, String password){
		this.lastName = lastName;
		this.firstName = firstName;
		this.email = email;
		this.password = password;
		this.loggedIn = true;
		DbUtilities db = new DbUtilities();
		StringBuilder query = new StringBuilder(250);
		query.append("INSERT INTO users ");
		query.append("(lastName, firstName, email, password) ");
		query.append("VALUES ('" + lastName + "', '" + firstName + "', ");
		query.append("'" + email + "', MD5('" + password + "') ); ");
		db.executeQuery(query.toString());
		
		query = new StringBuilder(100);
		query.append("SELECT userID ");
		query.append("FROM users ");
		query.append("WHERE email = '" + email + "' ");
		query.append("AND password = MD5('" + password + "'); ");
		ResultSet rs = db.getResultSet(query.toString());
		try {
			rs.next();
			this.userID = rs.getInt("userID");
			db.closeConnection();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void saveUserInfo(){
		DbUtilities db = new DbUtilities();
		StringBuilder query = new StringBuilder(250);
		query.append("UPDATE users ");
		query.append("SET lastName = '" + this.lastName + "','");
		query.append("firstName = '" + this.firstName + "','");
		query.append("email = " + this.email + "' ");
		if(this.password != null){
			query.append(",password = MD5('" + this.password + "')");
		}
		query.append(";");
		db.executeQuery(query.toString());
	}
}
