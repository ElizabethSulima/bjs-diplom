const ratesBoard = new RatesBoard();
const logoutButton = new LogoutButton();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();

function handleMoneyManager(response) {
  if (response.success === true) {
    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(true, response.message);
  } else {
    moneyManager.setMessage(false, response.error);
  }
}

function refreshFavorite(data) {
  favoritesWidget.clearTable();
  favoritesWidget.fillTable(data);
  moneyManager.updateUsersList(data);
}

function updateFavorites(data, response) {
  if (response.success === true) {
    refreshFavorite(data);
    favoritesWidget.setMessage(true, response.message);
  }
}

function getCurrentUser() {
  ApiConnector.current((response) => {
    if (response.success === true) {
      ProfileWidget.showProfile(response.data);
    } else {
      alert(response);
    }
  });
}

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

const updateIntervalMs = 60 * 1000;
const intervalId = setInterval(fetchRates, updateIntervalMs);

moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    handleMoneyManager(response);
  });
};

moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    handleMoneyManager(response);
  });
};

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    handleMoneyManager(response);
  });
};

function loadInitialFavorites() {
  ApiConnector.getFavorites((response) => {
    try {
      refreshFavorite(response.data);
    } catch (error) {
      alert(error.message);
    }
  });
}

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

getCurrentUser();
fetchRates();
loadInitialFavorites();
