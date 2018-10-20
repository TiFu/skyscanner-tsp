package tech.ananas.models;

import java.util.List;

public class Flight {
	private String startingCity;
	private String finalDestination;
	private double price;
	private int numberOfStops;
	private String departureTime;
	private String arrivalTime;
	private int duration;
	private List<Leg> legs;
	

	public Flight(String startingCity, String finalDestination, double price, int numberOfStops, String departureTime,
			String arrivalTime, int duration, List<Leg> legs) {
		this.startingCity = startingCity;
		this.finalDestination = finalDestination;
		this.price = price;
		this.numberOfStops = numberOfStops;
		this.departureTime = departureTime;
		this.arrivalTime = arrivalTime;
		this.duration = duration;
		this.legs = legs;
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
