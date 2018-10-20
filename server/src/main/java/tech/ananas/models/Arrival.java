package tech.ananas.models;

public class Arrival {
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
