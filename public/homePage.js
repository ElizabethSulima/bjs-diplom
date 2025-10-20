function getCurrentUser() {
  ApiConnector.current((response) => {
    if (response.success === true) {
      ProfileWidget.showProfile(response.data);
    } else {
      alert(response);
    }
  });
}

getCurrentUser();

// ok

const ratesBoard = new RatesBoard();

function fetchRates() {
  ApiConnector.getStocks((response) => {
    if (response.success === true) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    } else {
      alert(response);
    }
  });
}

fetchRates();
const updateIntervalMs = 60 * 1000;
const intervalId = setInterval(fetchRates, updateIntervalMs);

//  ok

const moneyManager = new MoneyManager();

function handleApiResponse(response) {
  try {
    if (response.success === true) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, response.message);
    }
  } catch (error) {
    moneyManager.setMessage(false, error);
  }
}

moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    handleApiResponse(response);
  });
};

moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    handleApiResponse(response);
  });
};

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    handleApiResponse(response);
  });
};

// favorites

const favoritesWidget = new FavoritesWidget();

function updateFavorites(data, response) {
  if (response.success === true) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(data);
    moneyManager.updateUsersList(data);
    favoritesWidget.setMessage(true, response.message);
  }
}

function loadInitialFavorites() {
  ApiConnector.getFavorites((response) => {
    try {
      if (response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
      }
    } catch (error) {
      alert(error.message);
    }
  });
}

loadInitialFavorites();

favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) => {
    try {
      updateFavorites(data, response);
    } catch (error) {
      favoritesWidget.setMessage(false, error.message);
    }
  });
};

favoritesWidget.removeUserCallback = (data) => {
  ApiConnector.removeUserFromFavorites(data, (response) => {
    try {
      updateFavorites(data, response);
    } catch (error) {
      favoritesWidget.setMessage(false, error.message);
    }
  });
};

// exit ok

const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout((response) => {
    try {
      if (response.success === true) {
        location.reload();
        clearInterval(intervalId);
      }
    } catch (error) {
      alert(error.message);
    }
  });
};
