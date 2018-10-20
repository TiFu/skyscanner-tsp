package tech.ananas.services;

import java.util.HashMap;
import java.util.Map;

import tech.ananas.models.Session;
import tech.ananas.models.User;

public class SessionService {
	private Map<String, Session> sessions;
	private int sessionId = 1;
	
	public SessionService() {
		this.sessions = new HashMap<>();
	}
	
	public synchronized String createNewSession(User user) {
		String sessId = "" + this.sessionId;
		this.sessions.put(sessId, new Session(sessId, user));
		this.sessionId++;
		return sessId;
	}
	
	public Session getSession(String id) {
		return this.sessions.get(id);
	}
}
