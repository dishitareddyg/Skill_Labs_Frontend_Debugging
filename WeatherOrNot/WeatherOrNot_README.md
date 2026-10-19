# Weather or Not: Debugging Mini Project

> **Scenario.** Weather or Not is a small weather dashboard that fetches data through an asynchronous (simulated) API. It looks and feels like a real app, but users have noticed that it sometimes shows numbers or messages that do not belong to the city they asked for. You are the developer who has to work out why, prove it with evidence, and fix it.

| | |
|---|---|
| **Type** | Debugging with asynchronous JavaScript (front end only) |
| **You need** | A browser (Chrome, Edge or Firefox recommended), a code editor such as VS Code, and optionally Git |
| **Allowed** | Vanilla HTML, CSS and JavaScript only. No libraries, no frameworks, no CDNs, no real network requests |

All cities and numbers are **fictional sample data**. No account or API key is needed.

---

## 1. What you will practise

| Skill | What "done" looks like |
|---|---|
| Map data to the screen | For any value on the page you can name the property it comes from and the line of code that writes it. |
| Follow async code | You can explain, in order, what `loadCity()` does before, during and after the `await`. |
| Spot stale data | You can tell when something on screen belongs to an earlier request, and say why. |
| Handle every state | You have checked loading, success, unsupported city, failure and empty input, and then checked them again after switching cities. |

---

## 2. Quick start

**Windows:** unzip the whole `WeatherOrNot` folder (do not run files from inside the ZIP), then double-click **`start.bat`**.

**If that does not work:** open Command Prompt in the folder and run `.\start.bat`, or double-click `index.html`, or drag it onto a browser window. On macOS or Linux, open `index.html` in a browser.

**After editing:** save and refresh. Use `Ctrl + F5` if nothing changes.

---

## 3. What is in the folder

| File | What it does | Will you edit it? |
|---|---|---|
| `index.html` | Page structure: search form, city buttons, status area, weather panel. | Rarely. |
| `style.css` | Colours, layout, the dimmed "loading" look, responsive rules. | No. |
| `script.js` | Sample data, the mock API (`fetchWeather`), rendering and event handling. | **Yes. All bugs are here.** |
| `weather-data.json` | Readable reference copy of the sample data. The app does **not** load it. | No. Use it to check values. |
| `start.bat` | Windows launcher. | No. |
| `README.md` | This guide. | No. |

### How the pieces connect

```
click or Enter  →  loadCity(name)  →  fetchWeather(name)  ──(about 1.2 s)──►  record | null | error
                        │                                                          │
              shows spinner + status                                  renderCurrent() + renderForecast()
                                                                      or unsupported / error message
```

### The simulated API

`fetchWeather()` returns a **Promise** and uses `setTimeout` to wait about 1.2 seconds, as a real network call would. It does one of three things:

| Outcome | When | What `loadCity()` receives |
|---|---|---|
| **Resolves with a record** | The city is in the sample data. | A copy of that city's object. |
| **Resolves with `null`** | The city is not in the sample data. | `null` |
| **Rejects with an error** | **Simulate a failed request** is ticked. | An exception caught by `catch`. |

Browsers usually block `fetch()` for local `file://` pages, which is why the data is kept in `script.js` instead of being loaded from the JSON file.

---

## 4. The sample data

### Fields on every city

| Field | Type | Shown on the page as |
|---|---|---|
| `city`, `country` | string | The heading, for example "London, United Kingdom". |
| `condition` | string | Icon and label. One of `Sunny`, `Partly Cloudy`, `Cloudy`, `Rain`, `Thunderstorm`. |
| `temperatureC` | number | The large temperature, for example `14°C`. |
| `feelsLikeC` | number | **Feels like** box. |
| `humidityPercent` | number | **Humidity** box. |
| `windSpeedKmh` | number | **Wind speed** box. This is the steady wind. |
| `windGustKmh` | number | Not shown anywhere. A gust is a brief burst that is stronger than the steady wind. |
| `forecast` | array of 5 | The five forecast cards (below). |

Each forecast item has `day`, `condition`, `highC`, `lowC` and `rainChancePercent`. A card shows them as, for example, `Fri`, `☀️`, `Sunny`, `17° / 9°`, `10% rain`.

### What the page should show for each city

| City | Condition | Temp | Feels like | Humidity | Wind speed |
|---|---|---|---|---|---|
| London | Cloudy | 14°C | 12°C | 78% | 19 km/h |
| Tokyo | Partly Cloudy | 21°C | 21°C | 62% | 11 km/h |
| New York | Sunny | 17°C | 15°C | 48% | 16 km/h |
| Sydney | Sunny | 24°C | 25°C | 55% | 22 km/h |
| Bengaluru | Partly Cloudy | 27°C | 29°C | 66% | 9 km/h |
| Cairo | Sunny | 31°C | 30°C | 28% | 14 km/h |

### Friday (the fifth forecast card) for each city

| City | Condition | High / Low | Rain chance |
|---|---|---|---|
| London | Sunny | 17° / 9° | 10% |
| Tokyo | Partly Cloudy | 21° / 14° | 25% |
| New York | Sunny | 16° / 7° | 10% |
| Sydney | Cloudy | 21° / 16° | 35% |
| Bengaluru | Partly Cloudy | 27° / 20° | 25% |
| Cairo | Sunny | 30° / 19° | 0% |

Mon to Thu for every city are in `weather-data.json`. Open the file to compare the full set.

---

## 5. What the app should do in every state

| State | Spinner | Status line | Message box | Weather panel |
|---|---|---|---|---|
| **Loading** (request in progress) | Visible, "Fetching weather…" | "Loading weather for *City*…" | None | If a city was already showing, it stays visible and dimmed, **unchanged**, until the new data arrives. |
| **Success** | Gone | "Showing sample weather for *City*." | **None.** Nothing left over from an earlier request. | Fully visible. Every value belongs to *City*. |
| **City not supported** | Gone | "No sample data for *City*." | Blue box listing the supported cities | Hidden |
| **Failure** | Gone | "The request for *City* failed." | Red box with a **Retry** button | Hidden |
| **Empty search** | No change | "Please type a city name or pick one of the cities below." | No change | No change |

Further rules:

| ID | Rule |
|---|---|
| R1 | City names are not case-sensitive, and spaces around the name are ignored. |
| R2 | Supported cities are London, Tokyo, New York, Sydney, Bengaluru and Cairo. |
| R3 | Every number and label on the panel matches that city's record (tables in section 4). |
| R4 | All five forecast cards belong to the selected city. |
| R5 | When two requests overlap, only the newest one may change the page. |
| R6 | Once a request has finished, the page describes that request's result and nothing else. |
| R7 | **Retry** repeats the last request. Ticking or unticking **Simulate a failed request** only affects requests started afterwards. |

---

## 6. Known issues: start here

These are symptoms from testers. They are a starting point, **not a complete list**, and one row can describe more than one defect. Compare the whole app against section 5.

| # | Symptom | See it for yourself | Where to start looking |
|---|---|---|---|
| 1 | One figure in the row under the temperature is wrong for every city. | Load London and compare the three boxes with the table in section 4. | Compare the property names in the data with the ones the rendering function reads. |
| 2 | After switching cities, some things on screen belong to the previous city. This happens at two different moments. | Load London, then pick Tokyo. First, watch the page during the 1.2 s wait. Then, after it finishes, compare **all five** forecast cards with Tokyo's data. | What does `loadCity` change before the `await`? What does the forecast code remember between calls? |
| 3 | The page does not always describe the request that just finished. | Tick **Simulate a failed request** and pick Sydney. Untick it and pick Cairo. Read everything on the page. | Which helper hides the red message, and which code paths call it? |

---

## 7. Test checklist

Reload before each test. "Wait" means wait for the spinner to disappear.

| Test | Steps | Expected result | Before fix | After fix |
|---|---|---|---|---|
| T1 Every city | Pick each of the six cities in turn and wait. | Every value matches the tables in section 4. | ☐ | ☐ |
| T2 Loading look | Load London, then pick Tokyo and look **during** the wait. | Spinner shows. Status line says Tokyo is loading. The dimmed panel still shows London's heading **and** London's numbers. | ☐ | ☐ |
| T3 After switch | Wait for Tokyo to finish. | Heading, numbers and all five forecast cards are Tokyo's. Friday reads `21° / 14°`. | ☐ | ☐ |
| T4 Three in a row | Pick London, then Tokyo, then New York, waiting each time. | After each wait, the Friday card matches the table in section 4 for that city. | ☐ | ☐ |
| T5 Failure | Tick **Simulate a failed request** and pick Sydney. | Spinner gone. Red message with **Retry**. Panel hidden. | ☐ | ☐ |
| T6 Recovery by choosing | Untick the box and pick Cairo. | Cairo's weather shows. **No red message** remains. Status line says Cairo. | ☐ | ☐ |
| T7 Recovery by Retry | Tick the box, pick Tokyo (fails). Untick the box, press **Retry**. | Tokyo's weather shows. Red message is gone. | ☐ | ☐ |
| T8 Not supported | Type `Atlantis` and press **Get weather**. | Spinner gone. Blue message lists the six cities. Panel hidden. | ☐ | ☐ |
| T9 After not supported | Now pick London. | Blue message disappears. London shows correctly. | ☐ | ☐ |
| T10 Empty search | Clear the box and press **Get weather**. | Only the status line changes. | ☐ | ☐ |
| T11 Case and spaces | Type `  tOkYo  ` and submit. | Tokyo's weather shows. | ☐ | ☐ |
| T12 Rapid switching | Pick London, then Tokyo within one second. | Only Tokyo is ever displayed. The spinner stops when Tokyo arrives. | ☐ | ☐ |
| T13 Failure while showing a city | Show London. Tick the box and pick Tokyo. | London's panel is replaced by the red message, not by a mix of London and Tokyo. | ☐ | ☐ |

---

## 8. Debugging workflow

### A. Reproduce
Write down the exact clicks: which city, in which order, and whether the failure box was ticked. Repeat them and confirm the problem happens every time.

### B. Compare the screen with the data
1. Pick a city and note every value on screen.
2. In the Console, type `WEATHER_DATA` and expand that city's object.
3. Put the two side by side. Which value does not match?
4. Find the element in `index.html` and the line in `script.js` that fills it.

### C. Trace the order of events
Add timestamped logs in `loadCity()`: before the request, after it resolves, and inside `finally`.

```js
console.log("before fetch", Date.now(), cityName);
console.log("after fetch", Date.now(), cityName);
console.log("finally", Date.now(), cityName);
```

Select a city and read the messages in order. At each moment ask: **what is already on screen, and which request did it come from?** Pay attention to the 1.2 seconds in the middle, not only the end.

### D. Check every state
Test a supported city, an unsupported city, an empty search and a simulated failure. After each one, look at the spinner, the status line, both message boxes and the weather panel. Then switch to a different city and look again.

### DevTools cheat sheet

Open with `F12` or `Ctrl + Shift + I`.

| I want to... | Do this |
|---|---|
| Read the real data | Console tab, type `WEATHER_DATA[0]` (or any index 0 to 5). |
| See what the page looks like right now | Elements tab, click the pointer icon, click something on the page. Watch the text and the `hidden` attribute change. |
| Slow things down | Sources tab, open `script.js`, click a line number inside `loadCity()` to set a breakpoint, then step with `F10`. Watch values in the **Scope** panel. |
| Confirm no real requests are made | Network tab. Nothing is sent for weather data. That is expected. |
| See start-up messages | Open the Console, then reload with `Ctrl + R`. |

---
