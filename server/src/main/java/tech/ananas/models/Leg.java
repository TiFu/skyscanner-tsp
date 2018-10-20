package tech.ananas.models;

public class Leg {
	private int duration;
	private String carrier;
	private String flightNumber;
	private Departure departure;
	private Arrival arrival;
	
	public int getDuration() {
		return duration;
	}
	
	public String getCarrier() {
		return carrier;
	}
	
	public String getFlightNumber() {
		return flightNumber;
	}
	
	public Departure getDeparture() {
		return departure;
	}
	
	public Arrival getArrival() {
		return arrival;
	}
}
