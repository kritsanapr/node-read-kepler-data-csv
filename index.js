const { parse } = require("csv-parse");
const fs = require("fs");

const habitablePlanets = [];

/**
 * The function checks if a planet is habitable based on its koi_disposition, koi_insol, and koi_prad
 * properties.
 * @param planet - The parameter `planet` is an object that represents a planet and contains various
 * properties such as `koi_disposition`, `koi_insol`, and `koi_prad`. The function `isHabitablePlanet`
 * takes this object as input and returns a boolean value indicating whether the planet
 * @returns The function `isHabitablePlanet` is returning a boolean value based on whether the input
 * `planet` meets certain criteria. If the planet's `koi_disposition` is "CONFIRMED", its `koi_insol`
 * value is between 0.36 and 1.11, and its `koi_prad` value is less than 1.6, then
 */
const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

/* The code is reading data from a CSV file named "kepler_data.csv" using the `fs` module's
`createReadStream` method. The data is then being parsed using the `csv-parse` module's `parse`
method with the options of ignoring lines starting with "#" and treating the first line as column
headers. The parsed data is then being piped to the `on` method, which listens for the "data" event
and checks if the planet is habitable using the `isHabitablePlanet` function. If the planet is
habitable, it is added to the `habitablePlanets` array. The code also listens for the "error" and
"end" events. When the "end" event is triggered, the code logs the names of the habitable planets
and the total number of habitable planets found. */
fs.createReadStream("./kepler_data.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(
      habitablePlanets.map((planet) => {
        return planet["kepler_name"];
      })
    );

    console.log(`${habitablePlanets.length} habitable planets found!`);
  });
