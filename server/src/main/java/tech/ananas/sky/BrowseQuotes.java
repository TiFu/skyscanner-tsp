package tech.ananas.sky;

import java.util.List;

public class BrowseQuotes {
	@Override
	public String toString() {
		return "BrowseQuotes [quotes=" + Quotes + ", places=" + Places + ", carriers=" + Carriers + "]";
	}
	private List<Quote> Quotes;
	private List<Place> Places;
	private List<Carrier> Carriers;
}
