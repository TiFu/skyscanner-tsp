package tech.ananas.models;

import java.util.LinkedList;
import java.util.List;

public class Session {
	private String id;
	private List<User> users;
	private Route[] routes;
	
	public Session(String id, User user) {
		this.id = id;
		this.users = new LinkedList<>();
		this.users.add(user);
	}
}
