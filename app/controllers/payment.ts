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

async function createCheckoutSession(
  priceId: string,
  quantity: string,
  customerId: string,
  slug: string
) {
  try {
    console.log(
      "creating checkout session for ",
      customerId,
      priceId,
      quantity,
      slug
    );
    const data = await fetch("/api/payment/checkout", {
      method: "POST",
      body: JSON.stringify({
        customerId: customerId,
        priceId: priceId,
        quantity: parseInt(quantity),
        slug: slug,
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

async function createPortalSession(customerId: String) {
  try {
    const data = await fetch("/api/payment/customerPortal", {
      method: "POST",
      body: JSON.stringify({
        customerId: customerId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await data.json();
    console.log("portal session", res);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getCheckoutSession(sessionId: string) {
  try {
    const data = await fetch(`/api/payment/checkout?sessionId=${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();
    console.log("checkout session details", response);
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export {
  createCustomer,
  createCheckoutSession,
  createPortalSession,
  getCheckoutSession,
};
