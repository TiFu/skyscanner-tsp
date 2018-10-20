package tech.ananas.models;

import java.util.List;

public class Trip {
	private List<FlightAlternatives> flights;
	
	public Trip(List<FlightAlternatives> flights) {
		this.flights = flights;
	}
	
	public List<FlightAlternatives> getFlights() {
		return flights;
	}
}
