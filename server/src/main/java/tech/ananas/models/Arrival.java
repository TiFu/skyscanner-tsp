package tech.ananas.models;

import java.io.Serializable;

public class Arrival implements Serializable {
	private String code;
	private String coordinates;
	private String time;
	private String airport;

	public Arrival(String code, String coordinates, String time, String airport) {
		super();
		this.code = code;
		this.coordinates = coordinates;
		this.time = time;
		this.airport = airport;
	}
	public Arrival(Arrival arrival) {
		this.code = arrival.code;
		this.coordinates = arrival.coordinates;
		this.time = arrival.time;
		this.airport = arrival.airport;
	}
	public String getCode() {
		return this.code;
	}
	
	public String getCoordinates() {
		return coordinates;
	}
	
	public String getTime() {
		return time;
	}
	
	public String getAirport() {
		return airport;
	}
	@Override
	public String toString() {
		return "Arrival [code=" + code + ", coordinates=" + coordinates + ", time=" + time + ", airport=" + airport
				+ "]";
	}
}
