package tech.ananas.models;

import java.util.List;
import java.util.Map;

public class SubmitCityListRequest {
	private String id;// session id
	private String requestID;
	private String routeName;
	private String startingCity;
	private List<String> cities;
	private List<List<String>> ignoreFlight;
	private Map<String,Integer> durationOfStay;
	private String earliestDeparture;
	
	public String getId() {
		return this.id;
	}
	
	public String getRequestID() {
		return requestID;
	}
	
	public String getRouteName() {
		return routeName;
	}
	
	public String getStartingCity() {
		return startingCity;
	}
	
	public List<String> getCities() {
		return cities;
	}
	
	public List<List<String>> getIgnoreFlight() {
		return ignoreFlight;
	}
	
	public Map<String, Integer> getDurationOfStay() {
		return durationOfStay;
	}
	
	public String getEarliestDeparture() {
		return earliestDeparture;
	}
}
