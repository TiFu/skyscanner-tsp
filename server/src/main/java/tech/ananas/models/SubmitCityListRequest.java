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
	
	public SubmitCityListRequest(String startingCity, String earliestDeparture, List<String> cities, List<List<String>> ignoreFlight, Map<String,Integer> durationOfStay) {
		this.startingCity = startingCity;
		this.earliestDeparture = earliestDeparture;
		this.cities = cities;
		this.ignoreFlight = ignoreFlight;
		this.durationOfStay = durationOfStay;
	}
	
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

	public void setId(String id) {
		this.id = id;
	}

	public void setRequestID(String requestID) {
		this.requestID = requestID;
	}

	public void setRouteName(String routeName) {
		this.routeName = routeName;
	}

	public void setStartingCity(String startingCity) {
		this.startingCity = startingCity;
	}

	public void setCities(List<String> cities) {
		this.cities = cities;
	}

	public void setIgnoreFlight(List<List<String>> ignoreFlight) {
		this.ignoreFlight = ignoreFlight;
	}

	public void setDurationOfStay(Map<String, Integer> durationOfStay) {
		this.durationOfStay = durationOfStay;
	}

	public void setEarliestDeparture(String earliestDeparture) {
		this.earliestDeparture = earliestDeparture;
	}
}
