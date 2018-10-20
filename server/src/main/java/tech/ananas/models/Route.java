package tech.ananas.models;

import java.util.List;
import java.util.Map;

public class Route {
	private String owner;
	private String routeName;
	private List<String> cities;
	private List<List<String>> ignoreFlight;
	private Map<String,Integer> durationOfStay;
	private String earliestDeparture;
	private Trip trip;
	
	public String getOwner() {
		return owner;
	}
	
	public String getRouteName() {
		return routeName;
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
	
	public Trip getTrip() {
		return trip;
	}
	
	public void update(Route r) {
		this.owner = r.getOwner();
		this.routeName = r.getRouteName();
		this.cities = r.getCities();
		this.ignoreFlight = r.getIgnoreFlight();
		this.durationOfStay = r.getDurationOfStay();
		this.trip = r.getTrip();
	}
}
