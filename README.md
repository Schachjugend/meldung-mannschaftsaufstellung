# Formular zur Meldung der Mannschaftsaufstellung

*Legacy Note: Teilfunktionen dieser Toolsammlung wurden unterdessen direkt ins DSJ-Turnierportal integriert.*

Dieses Tool generiert für jede Mannschaft ein Formular, über das die in der aktuellen Runde tatsächlich eingesetzten Spieler gemeldet werden können. Es kann ebenso zur Generierung der Antrittsbögen genutzt werden. **Benötigt zwingend node.js v0.10.**

## Nutzung

1. In SwissChess komplette Teilnehmerliste exportieren, d.h.
	1. Mannschaftsliste öffnen
	2. Bearbeiten > Datenaustausch (F8)
	3. Reiter "Export" auswählen, Einstellungen:
		- Auswahl: "Datengruppe 1"
		- "Exportdateien von Ansi nach ASCII umwandeln": nein
		- "Datenausgabe mit variabler Feldlänge": ja
2. `node < meine.csv > out.csv`
3. Encoding auf "ISO8859-1" umstellen, z.B. mit Sublime Texteditor
4. In Excel importieren und als Excel-Arbeitsmappe speichern
5. Serienbrief öffnen und Excel-Arbeitsmappe als Datenquelle auswählen

## Beispielaufrufe

```sh
> node convert.js --attributes=2,4 --attribute-names=AK,DWZ < ~/tmp/DLM-Teil.LST > ~/tmp/DLM-Teil.csv

> node convert.js --attributes=4 --attribute-names=DWZ < ~/tmp/dvm-u12-Teil.LST > ~/tmp/U12.csv
```
