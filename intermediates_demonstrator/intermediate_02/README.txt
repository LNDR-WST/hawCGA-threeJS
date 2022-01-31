 ██████  ██████   █████
██      ██       ██   ██
██      ██   ███ ███████
██      ██    ██ ██   ██
 ██████  ██████  ██   ██                                                                         02.02.2022


██████  ███████ ███    ███  ██████  ███    ██ ███████ ████████ ██████   █████  ████████  ██████  ██████
██   ██ ██      ████  ████ ██    ██ ████   ██ ██         ██    ██   ██ ██   ██    ██    ██    ██ ██   ██ ██
██   ██ █████   ██ ████ ██ ██    ██ ██ ██  ██ ███████    ██    ██████  ███████    ██    ██    ██ ██████
██   ██ ██      ██  ██  ██ ██    ██ ██  ██ ██      ██    ██    ██   ██ ██   ██    ██    ██    ██ ██   ██ ██
██████  ███████ ██      ██  ██████  ██   ████ ███████    ██    ██   ██ ██   ██    ██     ██████  ██   ██


████████ ██    ██ ██████  ███    ██ ████████  █████  ██████  ██      ███████
   ██    ██    ██ ██   ██ ████   ██    ██    ██   ██ ██   ██ ██      ██
   ██    ██    ██ ██████  ██ ██  ██    ██    ███████ ██████  ██      █████
   ██    ██    ██ ██   ██ ██  ██ ██    ██    ██   ██ ██   ██ ██      ██
   ██     ██████  ██   ██ ██   ████    ██    ██   ██ ██████  ███████ ███████

######################################################
## CGA Demontrator: Turntable
-----------------------------
LEANDER WERNST (2555900)
Media Systems, 4. Semester (WiSe 2021)
---
Computergrafik & Animation (Prof. Dr. Jan A. Neuhöfer)
Hochschule für Angewandte Wissenschaften Hamburg
Fakultät Design, Medien und Information

#############################
## INHALT

1. Projektbeschreibung
2. How to run
3. Features
4. Bekannte Probleme
5. Credits/Externe Quellen

#############################
## 1. PROJEKTBESCHREIBUNG

Das Projekt ist im Rahmen des Kurses "Computergrafik & Animation" im 4. Semester "Media Systems" an der Hochschule für
Angewandte Wissenschaften Hamburg mit Betreuung durch Prof. Dr. Jan A Neuhöfer entstanden.

Die Aufgabe des Projekts war, einen Three.js-Demonstrator zu entwickeln, in dem die im Kurs vermittelten Inhalte
angewandt werden, um ein aus einer GLTF-Datei geladenes Modell (selbst oder nicht selbst erstellt) aus
Three.js-Grundkörpern, Freiformgeometrien, Extrusionen, Constructive Solid Geometries etc. nachzubauen.
Das nachgebaute Modell sollte aus mindestens 10 Einzelteilen unter Verwendung von Materialien und Texturen bestehen und
durch verschiedene Funktionen, Animationen und Physik auf Benutzereingaben reagieren.

Zur Realisierung durften ausschließlich die in der Vorlesung genutzten Bibliotheken verwendet werden, die über
dieselben Pfade wie in den Kursbeispielen geladen werden sollten.
Darunter:
- Cannon.es
- Dat-Gui
- Three.js
- Three.csg
- Tween.js

Hauptbestandteil des hier gezeigten Demonstrators ist der (rechte) Plattenspieler, welcher auf Grundlage des linken,
von einer externen Quelle (siehe Punkt 5: Credits/externe Quellen) stammenden, Plattenspielers entstanden ist.
Bei der Originaldatei des geladenen Plattenspielers handelte es sich um eine FBX-Datei, die mithilfe der Software
Blender in das geforderte GLTF exportiert wurde. In diesem Zuge wurden die Texturen sowie Farbgebungen leicht angepasst
und Animationen erstellt. Die Geometrien selbst blieben unverändert.
Die (angepassten) Texturen des geladenen Plattenspielers wurden im Großen und Ganzen ebenfalls für den Nachbau in
Three.js verwendet.

Für ein stimmigeres Gesamtbild wurden die Plattenspieler zusammen mit zwei Lautsprechern auf einem Möbelstück platziert.
Diese Modelle stammen ebenfalls aus einer externen Quelle, wurden nur minimal korrigiert und wie die Vorlage des
Plattenspielers als GLTF in die Three.js-Szene geladen.


#############################
## 2. HOW TO RUN

#############################
## 3. FEATURES

****************
* KAMERA
****************
Mithilfe der Maus kann die Kamera innerhalb der Szene bewegt werden (Orbit Controls).

- Linke Maustaste:    Rotation
- Mausrad:            Zoom
- Rechte Maustaste    Pan

****************
* PLATTENSPIELER
****************

Beide Plattenspieler können durch Mausklicks (linke Maustaste) gesteuert werden.
Dabei sind folgende Aktionen möglich:

- On-Off-Switch:      Einschalten des Plattenspielers (rotes Licht als Indikator am Power-Switch)
- Start/Stop-Button:  Starten/Stoppen der Drehschreibe
- Nadellicht:         Hoch- und Runterdrücken des Nadellichtzylinders (links runter, rechts hoch)
- 45/33 RPM Buttons:  Ändern der Abspielgeschwindigkeit
- Arm:                Ein Klick auf den Arm senkt bzw. hebt diesen (wenn die Platte nicht läuft)

Läuft der Plattenspieler (Drehscheibe mit Platte drehen sich) und befindet sich der Arm bzw. dessen Nadel auf der
Schallplatte, wird Musik abgespielt. Beide Plattenspieler spielen unabhängig voneinander dieselbe Musik ab.
Ist die Musik zuende, die Nadel aber weiterhin auf der Schallplatte und dreht sich die Scheibe weiterhin, hört man
die Platte rauschen/knacken.
Die Abspielgeschwindigkeit des Sounds kann verändert werden, die sichtbare Drehgeschwindigkeit bleibt dieselbe.

****************
* Lautsprecher
****************

Die Lautsprecher geben die von den Plattenspielern abgespielte Musik wieder. Sie sind mit "Positional Audio" so
eingestellt, dass der gut hörbare Bereich auch vor diesen Lautsprechern liegt.Bewegt sich die Kamera hinter die
Lautsprecher oder sehr weit von diesen weg, nimmt die Lautstärke der Sounds ab.

****************
* PHYSIK
****************

Die Szene und die sich darin befindenden Objekte sind mit physikalischen Eigenschaften ausgestattet (Schwerkraft und
Masse). Um Kollisionen zu verursachen können mit einem Klick auf die Leertaste Tennisbälle geschossen werden.
Die Flugrichtung der Tennisbälle orientiert sich ausgehend von der Kamera an der aktuellen Mauszeigerposition, wodurch
grob gezielt werden kann.

- Leertaste + Mauszeiger:   Schuss/Wurf eines Tennisballs

Die Plattenspieler sowie die Lautsprecher sind dynamische Körper, d.h. sie reagieren auf jegliche Kollisionen.
Der Schranktisch hingegen ist statisch: Objekte kollidieren mit diesem Körper, der Körper selbst reagiert aber nicht
auf diese Kollisionen. Hintergrund ist, dass aufeinander gestapelte Boxen mit physikalischen Eigenschaften (Cannon.js)
sehr unstabil sind und auf Dauer nicht still stehen (somit mit der Zeit herunterfallen). Das Problem lässt sich auch
in einem der offiziellen Beispiele nachvollziehen: http://schteppe.github.io/cannon.js/demos/convex.html ("convex on
convex").

****************
* GUI
****************

Das Lichtsetting lässt sich mit dem sich am rechten oberen Rand befindlichen Graphic User Interface einstellen.
Die Position der Lichtquellen ist dabei fest, je ein Spotlight verfolgt aber einen der Plattenspieler.
Die Lichtstimmung kann über die Intensität der vorhandenen Lichtquellen sowie die Farbgebung (getrennte RGB-Werte, wobei
die Werte 0-1 in dem GUI die RGB-Werte von 0-255 abbilden.


#############################
## 4. BEKANNTE PROBLEME

#############################
## 5. CREDITS/EXTERNE QUELLEN

Plattenspieler
Lautsprecher
Cabinet
Floor-Texture
Sound Crackling
Musik
Neuhöfer Skripte
Rotateabout point








Externe Quellen

Projekttitel
Beschreibung
Inhalt
Features
How to run
Bekannte Probleme
Credits