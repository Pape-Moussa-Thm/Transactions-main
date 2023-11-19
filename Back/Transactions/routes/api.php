<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/transactions/depot', [TransactionController::class, 'depot']);

Route::post('/transactions/retrait', [TransactionController::class, 'retrait']);

Route::post('/transactions/transfert', [TransactionController::class, 'transfert']);

Route::get('/numClient/{num}', [ClientController::class, 'getClientByNum']);

Route::get('/transClient/{num}', [ClientController::class, 'transClient']);

//-------------------------------------------------------------------------
// Ajout de client
Route::post('/clients', [ClientController::class, 'ajouterClient']);

// Ouverture de compte
Route::post('/addCompte', [CompteController::class, 'addCompte']);

// Fermeture de compte
Route::delete('/comptes/fermer/{client_id}', [CompteController::class, 'fermerCompte']);

//bloquer compte
Route:: get('/comptes/bloquer/{num_Compte}', [CompteController::class, 'bloquerCompte']);

//debloquer compte
Route::get('/debloquerCompte/{compte_id}', [CompteController::class, 'debloquerCompte']);

//annuler transaction
Route::get('/annulerTransaction/{codeTransaction}', [TransactionController::class, 'annulerTransaction']);

 //Flitrer l'historique de transaction d'un client
 Route::get('/clients/{clientId}/historique-transactions', [TransactionController::class, 'historiqueTransactions']);

 //lister compte
 Route::get('/listerCompte', [CompteController::class, 'listerCompte']);
