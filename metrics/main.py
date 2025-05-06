from flask import Flask, request, jsonify
from database import get_all_metrics, init_db, insert_metric
from datetime import datetime, timezone

app = Flask(__name__)

@app.route('/metrics', methods=['POST'])
def receive_metrics():
    data = request.json
    required_fields = ['operating_system', 'rendering_type', 'report', 'iteration_group', 'page']
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields in request'}), 400

    timestamp = datetime.now(timezone.utc).isoformat()
    insert_metric(
        data['operating_system'],
        data['rendering_type'],
        data['report'],
        data['iteration_group'],
        data['page'],
        timestamp
    )
    return jsonify({'status': 'Report saved successfully'}), 201

@app.route('/metrics', methods=['GET'])
def fetch_metrics():
    try:
        metrics = get_all_metrics()
        return jsonify(metrics), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=3001, debug=True)
