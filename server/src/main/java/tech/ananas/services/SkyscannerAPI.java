package tech.ananas.services;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import com.google.gson.Gson;
import com.google.gson.JsonElement;

import tech.ananas.sky.BrowseQuotes;

public class SkyscannerAPI {
	
	private String apikey;
	
	private String country = "ES";
	private String currency = "EUR";
	private String locale = "UK";

	public SkyscannerAPI(String apikey) {
		this.apikey = apikey;
	}
	
	public static void main(String[] args) throws IOException {
		SkyscannerAPI api = new SkyscannerAPI("ha973240724713587943361464989493");
		api.getQuotes("BCN", "FRA", "2018-10-30");
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
	    BrowseQuotes quotes = gson.fromJson(line, BrowseQuotes.class);
		return quotes;
	}
}
