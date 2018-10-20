package tech.ananas.sky;

import java.util.List;

public class BrowseQuotes {
	@Override
	public String toString() {
		return "BrowseQuotes [quotes=" + Quotes + ", places=" + Places + ", carriers=" + Carriers + "]";
	}
	public List<Quote> Quotes;
	public List<Place> Places;
	public List<Carrier> Carriers;
}
