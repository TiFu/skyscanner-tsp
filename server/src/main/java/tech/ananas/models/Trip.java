package tech.ananas.models;

import java.util.List;

public class Trip {
	private float totalPrice;
	private List<Flight> flights;
	
	public float getTotalPrice() {
		return totalPrice;
	}
	
	public List<Flight> getFlights() {
		return flights;
	}
}
