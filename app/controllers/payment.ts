async function createCustomer() {
  try {
    const data = await fetch("/api/payment/customer", {
      method: "POST",
      body: JSON.stringify({
        email: "poorvank@gmail.com",
        name: "poorvank",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await data.json();
    console.log("customer", res);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getCustomer() {
  try {
    const data = await fetch("/api/payment/customer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();
    console.log("list customers", response.customers.data);
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function createSubscription() {
  try {
    console.log('creating')
    const data = await fetch("/api/payment/subscription", {
      method: "POST",
      body: JSON.stringify({
        customerId: "cus_PwKirdR28may7r",
        priceId: "price_1P6RMSSEu7527fI69AjpXVxM",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await data.json();
    console.log("subscription", res);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function createCheckoutSession(){
  try {
    console.log('creating checkout session')
    const data = await fetch("/api/payment/checkout", {
      method: "POST",
      body: JSON.stringify({
        customerId: "cus_PwKirdR28may7r",
        priceId: "price_1P6RMSSEu7527fI69AjpXVxM",
        quantity: 10
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await data.json();
    console.log("checkout session", res);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }

}


async function getSubscriptions() {
  try {
    const data = await fetch(`/api/payment/subscription`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();
    console.log("subscription details", response.subscriptions.data);
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export { createCustomer, getCustomer, createSubscription, getSubscriptions, createCheckoutSession };
