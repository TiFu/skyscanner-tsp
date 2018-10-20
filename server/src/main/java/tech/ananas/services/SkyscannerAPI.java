package tech.ananas.services;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import tech.ananas.models.Arrival;
import tech.ananas.models.Departure;
import tech.ananas.models.Flight;
import tech.ananas.models.Leg;
import tech.ananas.sky.BrowseQuotes;

public class SkyscannerAPI {
	
	private String apikey;
	
	private String country = "ES";
	private String currency = "EUR";
	private String locale = "en-GB";
	private String cabinclass = "economy";
	private int adults = 1;
	private JsonObject places;
	
	public SkyscannerAPI(String apikey) {
		this.apikey = apikey;
		File places = new File(this.getClass().getClassLoader().getResource("places.json").getFile());
		StringBuffer lines = new StringBuffer();
		try (Scanner s = new Scanner(places)) {
			while (s.hasNextLine()) {
				lines.append(s.nextLine());
				lines.append("\n");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		Gson gson = new Gson();
		this.places = gson.fromJson(lines.toString(), JsonObject.class);
	}
	
	
	public List<Flight> getFlight(String sessionUrl) throws IOException {
		return this.getFlight(sessionUrl, 5);
	}
	
	public List<Flight> getFlight(String sessionUrl, int numberOfFlights) throws IOException {
		boolean searchDone = false;
		Gson gson = new Gson();
		JsonObject foundFlights = null;
		while (!searchDone) {
			URL url = new URL(sessionUrl + "?apikey=" + this.apikey + 
					"&sortType=price&sortOrder=asc&pageIndex=0&pageSize=" + numberOfFlights);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		    conn.setRequestMethod("GET");
		    conn.setRequestProperty("Accept", "application/json");

		    BufferedInputStream buffStream = new BufferedInputStream(conn.getInputStream());
		    BufferedReader r = new BufferedReader(
		            new InputStreamReader(buffStream, StandardCharsets.UTF_8));

		    String line = r.readLine();
		    JsonElement element = gson.fromJson(line, JsonElement.class);
		    String object = element.getAsJsonObject().get("Status").getAsString();		    
		    searchDone = object.equals("UpdatesComplete");
		    foundFlights = element.getAsJsonObject();
		}
	    System.out.println("Update complete!");
		
		// Fetch all itinaries
		JsonArray itineraries = foundFlights.get("Itineraries").getAsJsonArray();
		List<Flight> flights = new LinkedList<>();
		for (int i = 0; i < itineraries.size(); i++) {
			JsonObject itinerary = itineraries.get(i).getAsJsonObject();
			String legID = itinerary.get("OutboundLegId").getAsString();
			double price = itinerary.get("PricingOptions").getAsJsonArray().get(0).getAsJsonObject().get("Price").getAsDouble();
			String deepLink = itinerary.get("PricingOptions").getAsJsonArray().get(0).getAsJsonObject().get("DeeplinkUrl").getAsString();

			JsonObject leg = findById(legID, foundFlights.get("Legs").getAsJsonArray());
			int numberOfStops = leg.get("Stops").getAsJsonArray().size();
			
			String originStation = findById(leg.get("OriginStation").getAsString(), foundFlights.get("Places").getAsJsonArray()).get("Name").getAsString();
			String destinationStation = findById(leg.get("DestinationStation").getAsString(), foundFlights.get("Places").getAsJsonArray()).get("Name").getAsString();
			
			String departureTime = leg.get("Departure").getAsString();
			String arrivalTime = leg.get("Arrival").getAsString();
			int duration = leg.get("Duration").getAsInt();
			
			List<Leg> legSegments = new LinkedList<>();
			
			JsonArray segments = leg.get("SegmentIds").getAsJsonArray();
			for (int j = 0; j < segments.size(); j++) {
				String segmentId = segments.get(j).getAsString();
				JsonObject segment = findById(segmentId, foundFlights.get("Segments").getAsJsonArray());
				
				String flightNumber = segment.get("FlightNumber").getAsString();
				String legDepartureTime = segment.get("DepartureDateTime").getAsString();
				String legArrivalTime = segment.get("ArrivalDateTime").getAsString();

				JsonObject carrierObj = findById(segment.get("Carrier").getAsString(), foundFlights.get("Carriers").getAsJsonArray());
				String carrier = carrierObj.get("Name").getAsString();
				String carrierImg = carrierObj.get("ImageUrl").getAsString();
				
				flightNumber = carrierObj.get("Code").getAsString() + flightNumber;
				int legDuration = segment.get("Duration").getAsInt();
				
				String originStationId = segment.get("OriginStation").getAsString();
				String destinationStationId = segment.get("DestinationStation").getAsString();
				JsonObject departureObject = findById(originStationId, foundFlights.get("Places").getAsJsonArray());
				JsonObject arrivalObject = findById(destinationStationId, foundFlights.get("Places").getAsJsonArray());
				String departureAirport = departureObject.get("Name").getAsString();
				String arrivalAirport = arrivalObject.get("Name").getAsString();
				String departureAirportCode = departureObject.get("Code").getAsString();
				String arrivalAirportCode = arrivalObject.get("Code").getAsString();
				
				JsonObject departureAirportObj = this.findAirport(departureAirportCode);
				String departureCoordinates = departureAirportObj.get("Location").getAsString();
				String arrivalCoordinates = this.findAirport(arrivalAirportCode).get("Location").getAsString();
				Departure departure = new Departure(departureAirportCode, departureCoordinates, legDepartureTime, departureAirport);
				Arrival arrival = new Arrival(arrivalAirportCode, arrivalCoordinates, legArrivalTime, arrivalAirport);
				Leg l = new Leg(legDuration, carrier, carrierImg, flightNumber, departure, arrival);
				legSegments.add(l);
			}
			
			Flight f = new Flight(originStation, destinationStation, deepLink, price, numberOfStops, departureTime,
			arrivalTime, duration, legSegments);
			flights.add(f);
		}		
		return flights;
	}
		
	private JsonObject findById(String legId, JsonArray legs) {
		for (int i  = 0; i < legs.size(); i++) {
			JsonObject leg = legs.get(i).getAsJsonObject();
			if (leg.get("Id").getAsString().equals(legId)) {
				return leg;
			}
		}
		// shouldn't happen
		return null;
	}
	
	public JsonObject findAirport(String iata) {
		for (JsonElement continent: this.places.get("Continents").getAsJsonArray()) {
			for (JsonElement country: continent.getAsJsonObject().get("Countries").getAsJsonArray()) {
				for (JsonElement city: country.getAsJsonObject().get("Cities").getAsJsonArray()) {
					for (JsonElement airport: city.getAsJsonObject().get("Airports").getAsJsonArray()) {
						if (airport.getAsJsonObject().get("Id").getAsString().equals(iata)) { 
							return airport.getAsJsonObject();
						}

					}
				}
			}
		}
		return null;
	}
	
	public JsonObject getPlace(String place) {
		for (JsonElement continent: this.places.get("Continents").getAsJsonArray()) {
			for (JsonElement country: continent.getAsJsonObject().get("Countries").getAsJsonArray()) {
				for (JsonElement city: country.getAsJsonObject().get("Cities").getAsJsonArray()) {
					if (city.getAsJsonObject().get("Name").getAsString().equals(place)) { 
						return city.getAsJsonObject();
					}					
				}
			}
		}
		return null;
	}
	
	public String createSession(String originPlace, String destinationPlace, String outboundDate) throws IOException, SkyscannerAPIException {
		JsonObject origin = this.getPlace(originPlace);
		System.out.println(origin);
		JsonObject destination = this.getPlace(destinationPlace);
		System.out.println(destination);
		
		if (origin.get("IataCode") == null || destination.get("IataCode") == null) {
			throw new SkyscannerAPIException("Could not find " + originPlace + " or " + destinationPlace);
		}
		URL url = new URL("http://partners.api.skyscanner.net/apiservices/pricing/v1.0?apikey=" + this.apikey);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		
		conn.setDoOutput(true);
		conn.setRequestMethod("POST");
		conn.setRequestProperty("Accept", "application/json");
		
		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
		writer.write("cabinclass=" + this.cabinclass + 
				"&country=" + this.country + 
				"&currency=" + this.currency + 
				"&locale=" + this.locale + 
				"&locationSchema=iata" + 
				"&originplace=" + origin.get("IataCode").getAsString() + 
				"&destinationplace=" + destination.get("IataCode").getAsString() + 
				"&outbounddate=" + outboundDate + 
				"&adults=" + adults);
		writer.flush();
		writer.close();
		
	    if (conn.getResponseCode() >= 200 && conn.getResponseCode() < 299) {
	    	String location = conn.getHeaderField("Location");
		    return location;
	    } else {
	    	System.out.println("Response Code: " + conn.getResponseCode());
	    }
	    return null;
		
	}
	
	public BrowseQuotes getQuotes(String originPlace, String destinationPlace, String outboundPartialDate) throws IOException {
		URL url = new URL ("http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0"
				+ "/" + URLEncoder.encode(country, "UTF-8")
				+ "/" + URLEncoder.encode(currency, "UTF-8")
				+ "/" + URLEncoder.encode(locale, "UTF-8")
				+ "/" + URLEncoder.encode(originPlace, "UTF-8")
				+ "/" + URLEncoder.encode(destinationPlace, "UTF-8")
				+ "/" + URLEncoder.encode(outboundPartialDate, "UTF-8")
				+ "?apiKey=" + URLEncoder.encode(apikey, "UTF-8"));
		
		HttpURLConnection conn = (HttpURLConnection)url.openConnection();
	    conn.setRequestMethod("GET");
	    conn.setRequestProperty("Accept", "application/json");
	    
	    BufferedInputStream buffStream = new BufferedInputStream(conn.getInputStream());
	    
	    BufferedReader r = new BufferedReader(
	            new InputStreamReader(buffStream, StandardCharsets.UTF_8));

	    String line = r.readLine();
	    Gson gson = new Gson();
	    JsonElement elem = gson.fromJson(line, JsonElement.class);
	    System.out.println(elem);
	    BrowseQuotes quotes = gson.fromJson(line, BrowseQuotes.class);
	    System.out.print(quotes);
		return quotes;
	}
}
