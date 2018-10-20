package tech.ananas.models;

import java.util.HashMap;
import java.util.LinkedList;
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
	
	public Route(String routeName, String owner, List<String> cities, Map<String, Integer> durationOfStay) {
		this.cities = cities;
		this.ignoreFlight = new LinkedList<>();
		this.durationOfStay = durationOfStay;
		this.earliestDeparture = "";
		this.trip = null;
	}
	
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
	
	public void setOwner(String owner) {
		this.owner = owner;
	}

	public void setRouteName(String routeName) {
		this.routeName = routeName;
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

	public void setTrip(Trip trip) {
		this.trip = trip;
	}

	public void update(ReorderCitiesRequest data) {
		this.setCities(data.getOrder());
		this.setIgnoreFlight(data.getIgnoreFlight());
	}
}
