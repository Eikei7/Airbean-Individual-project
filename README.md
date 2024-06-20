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
| POST | /menu      |    Add product to menu |
| PUT | /menu/:id      |    Modify product in menu |
| DELETE | /menu/:id      |    Remove product from menu |
| POST | /campaign      |    Add products to campaign |
