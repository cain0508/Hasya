
def get_leaderboard(top_n=10):
    """Query the contract's ScoreSubmitted events and return top scores per wallet."""
    try:
        # Adjust event name/args to match your contract exactly
        event_filter = contract.events.ScoreSubmitted.create_filter(fromBlock=0)
        events = event_filter.get_all_entries()

        best_per_wallet = {}
        for e in events:
            wallet = e['args']['wallet']
            score = e['args']['score']
            timestamp = e['args'].get('timestamp', 0)
            tx_hash = e['transactionHash'].hex()

            if wallet not in best_per_wallet or score > best_per_wallet[wallet]['score']:
                best_per_wallet[wallet] = {
                    "wallet": wallet,
                    "score": score,
                    "timestamp": timestamp,
                    "tx_hash": tx_hash
                }

        leaderboard = sorted(best_per_wallet.values(), key=lambda x: x['score'], reverse=True)
        return leaderboard[:top_n]

    except Exception as e:
        return {"error": str(e)}
