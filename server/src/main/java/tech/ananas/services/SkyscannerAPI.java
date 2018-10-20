package tech.ananas.services;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import tech.ananas.models.Flight;
import tech.ananas.sky.BrowseQuotes;

public class SkyscannerAPI {
	
	private String apikey;
	
	private String country = "ES";
	private String currency = "EUR";
	private String locale = "en-GB";
	private String cabinclass = "economy";
	private int adults = 1;
	
	public SkyscannerAPI(String apikey) {
		this.apikey = apikey;
	}
	
	public static void main(String[] args) throws IOException {
		SkyscannerAPI api = new SkyscannerAPI("ha973240724713587943361464989493");
		String session = api.createSession("BCN", "FRA", "2018-10-30");
		Flight[] f = api.getFlight(session);
	}
	
	public Flight[] getFlight(String sessionUrl) throws IOException {
		boolean searchDone = false;
		Gson gson = new Gson();
		JsonObject foundFlights = null;
		while (!searchDone) {
			URL url = new URL(sessionUrl + "?apikey=" + this.apikey + 
					"&sortType=price&sortOrder=asc&pageIndex=0&pageSize=5");
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
		    System.out.println(line);
		}
		
		// 
		
		
		return null;
		
	}
	
	public String createSession(String originPlace, String destinationPlace, String outboundDate) throws IOException {
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
				"&locationSchema=iata\n" + 
				"&originplace=" + originPlace + 
				"&destinationplace=" + destinationPlace + 
				"&outbounddate=" + outboundDate + 
				"&adults=" + adults);
		writer.flush();
		writer.close();
		
	    if (conn.getResponseCode() >= 200 && conn.getResponseCode() < 299) {
	    	String location = conn.getHeaderField("Location");
	    	System.out.println(location);
		    return location;
	    } else {
	    	System.out.println(conn.getResponseCode());
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
