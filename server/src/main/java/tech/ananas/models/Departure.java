package tech.ananas.models;

public class Departure {
	private String code;
	private String coordinates;
	private String time;
	private String airport;
	
	public Departure(String code, String coordinates, String time, String airport) {
		super();
		this.code = code;
		this.coordinates = coordinates;
		this.time = time;
		this.airport = airport;
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
		return "Departure [code=" + code + ", coordinates=" + coordinates + ", time=" + time + ", airport=" + airport
				+ "]";
	}
}
