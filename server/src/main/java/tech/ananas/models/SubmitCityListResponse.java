package tech.ananas.models;

import java.util.List;

public class SubmitCityListResponse {
	private String requestId;
	private String routeName;
	private float totalPrice;
	private List<Flight> flights;
	
	public String getRequestId() {
		return requestId;
	}
	
	public String getRouteName() {
		return routeName;
	}
	
	public float getTotalPrice() {
		return totalPrice;
	}
	
	public List<Flight> getFlights() {
		return flights;
	}
}
