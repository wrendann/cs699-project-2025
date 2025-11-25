# run with: python3 backend/manage.py shell < backend/TFapp/scripts/populate_embeddings.py

import os
import django
import numpy as np
import fasttext

# # Django setup (when running via manage.py shell this may be unnecessary,
# # but including it makes the script runnable standalone if you adjust paths)
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'teamfinder.settings')
# django.setup()

from TFapp.models import Event, Team, User

MODEL_PATH = 'TFapp/recommendation/cc.en.300.bin'  # set to your fastText model binary
FASTTEXT_MODEL = None

def get_avg_fasttext_vector(text, model):
    tokens = text.split()
    if not tokens:
        return np.zeros(300, dtype=float)
    vecs = [model.get_word_vector(t) for t in tokens]
    return np.mean(vecs, axis=0)

def populate_event_embeddings(model):
    # Only update events explicitly marked dirty to avoid unnecessary work
    for ev in Event.objects.filter(embedding_needs_update=True):
        text = (ev.name or '') + ' ' + (ev.description or '')
        vec = get_avg_fasttext_vector(text, model)
        ev.set_embedding(vec)
        ev.mark_embedding_updated()
        ev.save(update_fields=['embedding', 'embedding_needs_update'])
    print('Event embeddings updated.')

def populate_user_embeddings(model):
    for u in User.objects.filter(embedding_needs_update=True):
        text = (u.bio or '') + ' ' + (u.skills or '') + ' ' + (u.interests or '')
        vec = get_avg_fasttext_vector(text, model)
        u.set_embedding(vec)
        u.mark_embedding_updated()
        u.save(update_fields=['embedding', 'embedding_needs_update'])
    print('User embeddings updated.')

def populate_team_embeddings(model):
    for t in Team.objects.filter(embedding_needs_update=True):
        text = (t.name or '') + ' ' + (t.description or '') + ' ' + (t.required_skills or '')
        vec = get_avg_fasttext_vector(text, model)
        t.set_embedding(vec)
        t.mark_embedding_updated()
        t.save(update_fields=['embedding', 'embedding_needs_update'])
    print('Team embeddings updated.')

def load_model():
    global FASTTEXT_MODEL
    FASTTEXT_MODEL = fasttext.load_model(MODEL_PATH)
    print('FastText model loaded.')
    return FASTTEXT_MODEL

def calculate_and_update_embeddings():
    print(FASTTEXT_MODEL)
    populate_event_embeddings(FASTTEXT_MODEL)
    populate_user_embeddings(FASTTEXT_MODEL)
    populate_team_embeddings(FASTTEXT_MODEL)

def mark_all_embeddings_dirty():
    Event.objects.all().update(embedding_needs_update=True)
    User.objects.all().update(embedding_needs_update=True)
    Team.objects.all().update(embedding_needs_update=True)
    print('All embeddings marked dirty.')