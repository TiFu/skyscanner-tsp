package tech.ananas.sky.request;

public class QuoteRequest {
    public String country;
    public String currency;
    public String locale;
    public String originPlace;
    public String destinationPlace;
    // Not a Date, can be yyyy-mm-dd, yyyy-mm, or anytime
    public String outboundPartialDate;
    public String inboundPartialDate;
    public String apiKey;
}
