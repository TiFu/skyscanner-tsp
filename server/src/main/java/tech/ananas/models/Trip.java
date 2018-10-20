package tech.ananas.models;

import java.util.List;

public class Trip {
	private float totalPrice;
	private List<Flight> flights;
	
	public Trip(List<Flight> flights, float totalPrice) {
		this.totalPrice = totalPrice;
		this.flights = flights;
	}
	
	public float getTotalPrice() {
		return totalPrice;
	}
	
	public List<Flight> getFlights() {
		return flights;
	}
}
