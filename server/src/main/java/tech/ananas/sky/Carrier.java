package tech.ananas.sky;

import java.io.Serializable;

public class Carrier implements Serializable {
    public long CarrierId;
    public String Name;
	@Override
	public String toString() {
		return "Carrier [CarrierId=" + CarrierId + ", Name=" + Name + "]";
	}
}
