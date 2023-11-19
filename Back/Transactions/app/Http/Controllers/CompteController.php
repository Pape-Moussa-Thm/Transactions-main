<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Requests\StoreCompteRequest;
use App\Http\Requests\UpdateCompteRequest;
use App\Models\Client;
use App\Models\Compte;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;



class CompteController extends Controller
{
    public function addCompte(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'telephone' => 'required',
            'fournisseur' => 'required|in:om,wv,wr,cb',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $client = Client::where('telephone', $request->input('telephone'))->first();

        if (!$client) {
            return response()->json(['error' => 'Client non trouvé'], 404);
        }

        // Générer un numéro de compte unique en fonction du fournisseur et du numéro de téléphone du client
        $numeroCompte = $this->generateNumeroCompte($request->input('fournisseur'), $client);

        // Créer un nouveau compte pour le client avec un solde initial de 0
        $compte = Compte::create([
            'client_id' => $client->id,
            'solde' => 0,
            'num_compte' => $numeroCompte,
            'fournisseur' => $request->input('fournisseur'),
        ]);

        return response()->json(['message' => 'Compte ouvert avec succès', 'compte' => $compte], 201);
    }

    private function generateNumeroCompte($fournisseur, $client)
    {
        if ($fournisseur === 'om' || $fournisseur === 'wv') {
            // Pour les fournisseurs 'om' et 'wv', utiliser le numéro de téléphone du client suivi d'un identifiant unique
            return $fournisseur . '_' . $client->telephone . '_' . uniqid();
        } elseif ($fournisseur === 'cb') {
            // Pour le fournisseur 'cb', utiliser un numéro de compte généré par défaut
            return 'cb_' . uniqid();
        }

        // Fournisseur inconnu, retourner une valeur par défaut
        return $fournisseur . '_' . uniqid();
    }

    public function fermerCompte(Request $request, $compteId)
{
    // Trouver le compte
    $compte = Compte::findOrFail($compteId);

    // Vérifier que le compte est déjà fermé
    if ($compte->etat === 'ferme') {
        return response()->json(['message' => 'Le compte est déjà fermé'], 200);
    }

    // Vérifier que le compte est ouvert
    if ($compte->etat !== 'ouvert') {
        return response()->json(['error' => 'Le compte doit être ouvert pour être fermé'], 400);
    }

    // Vérifier qu'aucune transaction n'a été effectuée depuis plus d'un jour
    if ($this->verifierTransactionsJour($compte)) {
        return response()->json(['error' => 'Impossible de fermer le compte car des transactions ont été effectuées dans les dernières 24 heures'], 400);
    }

    // Supprimer définitivement le compte si son état est "ferme"
    if ($compte->etat === 'ferme') {
        $compte->delete();
        return response()->json(['message' => 'Compte supprimé définitivement car il était déjà fermé'], 200);
    }

    // Mettre à jour l'état du compte à "ferme"
    $compte->update(['etat' => 'ferme']);

    return response()->json(['message' => 'Compte fermé avec succès'], 200);
}



public function bloquerCompte(Request $request, $numCompte)
    {
        
        $compte = Compte::findOrFail($numCompte);

        // Vérifier que le compte est débloqué (état = 1)
        if ($compte->etat != 1) {
            return response()->json(['error' => 'Le compte doit être débloqué pour être bloqué'], 400);
        }

        // Mettre à jour l'état du compte (état = 0 pour bloquer)
        $compte->update(['etat' => "0"]);

        return response()->json(['message' => 'Compte bloqué avec succès'], 200);
    }

    public function debloquerCompte($num)
    {
        $compte = Compte::where('num_compte', $num)->first();

        if (!$compte) {
            return response()->json(['message' => 'Compte introuvable'], 404);
        }

        $compte->update(["etat" => 1]);

        return response()->json(['message' => 'Compte débloqué avec succès'], 200);
    }

    public function listerCompte(){
        return Compte::all();
    }

    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompteRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Compte $compte)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Compte $compte)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompteRequest $request, Compte $compte)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Compte $compte)
    {
        //
    }
}
