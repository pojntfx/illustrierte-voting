# Die Illustrierte Voting

A quick and dirty voting system, based on socket.io. Forked from [github.com/csaldias/node_voting](https://github.com/csaldias/node_voting).

## Demo

Sadly, we had to take the demo offline due to too server costs. Feel free to host one yourself!

## Usage

```bash
# Set variables
sed -i s/DIE_ILLUSTRIERTE_VOTING_SOCKET/your-url/g ./frontend/edit.html # Use your own URL here (i.e. https://die-illustrierte-voting1.openshiftapps.com/ or just your / if it's localhost)
sed -i s/DIE_ILLUSTRIERTE_VOTING_SOCKET/your-url/g ./frontend/index.html
# Install dependencies
npm install
# Build and serve development version on http://localhost:8080
npm run dev
```

## Screenshots

> TODO: Add screenshots

## Documentation

> TODO: Add docs

## Deployment

```bash
# Build and serve production version on http://localhost:8080
npm start
```

## License

Die Illustrierte Voting
Copyright (C) 2018 Felicitas Pojtinger

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
