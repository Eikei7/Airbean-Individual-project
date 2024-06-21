# Airbean Individual project
 ## User requests:
| Request       | Route           | Result |
| ------------- |:-------------:| -----:|
| GET      |/ | Start |
| GET      |/about | About the company |
| POST | /cart      |    Add to cart |
| GET | /cart      |    View cart |
| DEL | /cart/:id      |    Remove product from cart |
| GET      |/order      |  View menu |
| POST | /order      |    Order |
| GET | /order/:orderid      |    Order confirmation and estimated delivery time|
| GET | /account/orders     |    Order history |
| POST | /account/register     |    Create account |
| GET | /account/users/:userid     |    View account details|
| POST | /account/login     |   Log in|
| GET | /account/status     |    See if user is logged in or logged out |
| POST | /account/logout     |    Log out and clear cart |

## Admin requests:
| Request       | Route           | Result |
| ----------------- |:-----------------:| ----------:|
| POST | /admin/login      |    Login as admin |

> [!Note]
> {"username":"erik","password":"password123"}
> 
> You will have a token returned, which is to be used later when adding, modifying or deleting products.

| Request       | Route           | Result |
| ----------------- |:-----------------:| ----------:|
| POST | /menu      |    Add product to menu |

> [!Note]
> {"id":20,"title":"Kokhett kaffe","desc":"Varmt!","price":30}
> 
> Before making the POST request, add the token from your login result as a header. Name: "Authorization", Value: [token]

| Request       | Route           | Result |
| ----------------- |:-----------------:| ----------:|
| PUT | /menu/:id      |    Modify product in menu |

> [!Note]
> Just like when adding a product, you add the token from the login result as header. Name: "Authorization", Value: [token]

| Request       | Route           | Result |
| ----------------- |:-----------------:| ----------:|
| DELETE | /menu/:id      |    Remove product from menu |

> [!Note]
> Just like when adding a product, you add the token from the login result as header. Name: "Authorization", Value: [token]

| Request       | Route           | Result |
| ----------------- |:-----------------:| ----------:|
| POST | /campaign      |    Add products to campaign |

> [!Note]
> Put two product ID's after each other in your request, and also the new total price.
> 
> { "products": ["XxbJYtuWvSY6xPu0", "qqLiQZEpe2Zh7KXQ"],
>	"price": 70 }
