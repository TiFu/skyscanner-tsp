package tech.ananas.models;

public class NewSessionResponse {
	private String id;

	public NewSessionResponse(String sessionId) {
		this.id = sessionId;
	}
	
	public String getId() {
		return id;
	}
}
