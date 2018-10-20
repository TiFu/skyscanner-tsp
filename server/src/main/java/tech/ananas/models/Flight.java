package tech.ananas.models;

import java.util.List;

public class Flight {
	private String startingCity;
	private String finalDestination;
	private float price;
	private int numberOfStops;
	private String departureTime;
	private String arrivalTime;
	private int duration;
	private List<Leg> legs;
	
	public String getStartingCity() {
		return startingCity;
	}
	
	public String getFinalDestination() {
		return finalDestination;
	}
	
	public float getPrice() {
		return price;
	}
	
	public int getNumberOfStops() {
		return numberOfStops;
	}
	
	public String getDepartureTime() {
		return departureTime;
	}
	
	public String getArrivalTime() {
		return arrivalTime;
	}
	
	public int getDuration() {
		return duration;
	}
	
	public List<Leg> getLegs() {
		return legs;
	}
}
