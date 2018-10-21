package tech.ananas.models;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

public class Flight implements Serializable {
	private String deepLink;
	private String startingCity;
	private String finalDestination;
	private double price;
	private int numberOfStops;
	private String departureTime;
	private String arrivalTime;
	private int duration;
	private List<Leg> legs;
	

	public Flight(String startingCity, String finalDestination, String deepLink, double price, int numberOfStops, String departureTime,
			String arrivalTime, int duration, List<Leg> legs) {
		this.deepLink = deepLink;
		this.startingCity = startingCity;
		this.finalDestination = finalDestination;
		this.price = price;
		this.numberOfStops = numberOfStops;
		this.departureTime = departureTime;
		this.arrivalTime = arrivalTime;
		this.duration = duration;
		this.legs = legs;	
	}

	public Flight(Flight f) {
		this.deepLink = f.deepLink;
		this.startingCity = f.startingCity;
		this.finalDestination = f.finalDestination;
		this.price = f.price;
		this.numberOfStops = f.numberOfStops;
		this.departureTime = f.departureTime;
		this.arrivalTime = f.arrivalTime;
		this.duration = f.duration;
		this.legs = new LinkedList<Leg>();
		for (Leg l: f.legs) {
			this.legs.add(new Leg(l));
		}
	}

	public String getDeepLink() {
		return deepLink;
	}

	public void setDeepLink(String deepLink) {
		this.deepLink = deepLink;
	}

	public String getStartingCity() {
		return startingCity;
	}
	
	public String getFinalDestination() {
		return finalDestination;
	}
	
	public double getPrice() {
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

	@Override
	public String toString() {
		return "Flight [startingCity=" + startingCity + ", finalDestination=" + finalDestination + ", price=" + price
				+ ", numberOfStops=" + numberOfStops + ", departureTime=" + departureTime + ", arrivalTime="
				+ arrivalTime + ", duration=" + duration + ", legs=" + legs + "]";
	}
}
