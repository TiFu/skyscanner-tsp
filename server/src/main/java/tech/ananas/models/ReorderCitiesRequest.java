package tech.ananas.models;

import java.util.List;

public class ReorderCitiesRequest {
	private String requestId;
	private String id;
	private String routeName;
	private List<String> order;
	private List<List<String>> ignoreFlight;
	
	public String getRequestId() {
		return requestId;
	}
	
	public String getId() {
		return id;
	}
	
	public String getRouteName() {
		return routeName;
	}
	
	public List<String> getOrder() {
		return order;
	}
	
	public List<List<String>> getIgnoreFlight() {
		return ignoreFlight;
	}
}
