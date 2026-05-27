import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { tournamentService } from '../../services/tournamentService';
import { sports } from '../../utils/constants';
import { cn } from '../../utils/cn';

const initialForm = {
  title: '',
  sportType: '',
  format: '',
  mode: '',
  venueDetails: '',
  location: '',
  googleMapsLink: '',
  rules: '',
  registrationStartDate: '',
  registrationEndDate: '',
  tournamentDate: '',
  participantLimit: '',
  contactEmail: '',
  contactPhone: '',
  prizeDetails: '',
  description: ''
};

const toDatetimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

export default function CreateTournament({ editMode = false }) {
  const [form, setForm] = useState(initialForm);
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!editMode || !id) return;
    tournamentService.detail(id).then(({ data }) => {
      const tournament = data.tournament;
      setForm({
        title: tournament.title || '',
        sportType: tournament.sportType || '',
        format: tournament.format || '',
        mode: tournament.mode || '',
        venueDetails: tournament.venueDetails || '',
        location: tournament.location || '',
        googleMapsLink: tournament.googleMapsLink || '',
        rules: tournament.rules || '',
        registrationStartDate: toDatetimeLocal(tournament.registrationStartDate),
        registrationEndDate: toDatetimeLocal(tournament.registrationEndDate),
        tournamentDate: toDatetimeLocal(tournament.tournamentDate),
        participantLimit: tournament.participantLimit || '',
        contactEmail: tournament.organizerContact?.email || '',
        contactPhone: tournament.organizerContact?.phone || '',
        prizeDetails: tournament.prizeDetails || '',
        description: tournament.description || ''
      });
      setPreview(tournament.bannerUrl || '');
    });
  }, [editMode, id]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries({ ...form, registrationStartDate: form.registrationStartDate || new Date().toISOString() }).forEach(([key, value]) => payload.append(key, value));
    if (banner) payload.append('banner', banner);
    try {
      if (editMode) {
        await tournamentService.update(id, payload);
      } else {
        await tournamentService.create(payload);
      }
      toast.success(editMode ? 'Tournament updated for admin approval' : 'Tournament submitted for admin approval');
      navigate('/organizer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create tournament');
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-green-600 dark:text-green-400">Organizer workflow</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{editMode ? 'Edit tournament' : 'Create tournament'}</h1>
      </div>
      <section className="glass-panel grid gap-4 rounded-3xl p-5 md:grid-cols-2">
        <input className="field md:col-span-2" placeholder="Tournament title" value={form.title} onChange={(event) => update('title', event.target.value)} required />
        <select className={cn('field', !form.sportType && 'text-slate-400')} value={form.sportType} onChange={(event) => update('sportType', event.target.value)} required>
          <option value="" disabled hidden>Sport type</option>
          {sports.map((sport) => <option key={sport} value={sport}>{sport}</option>)}
        </select>
        <input className="field" placeholder="Tournament format e.g. Knockout, League" value={form.format} onChange={(event) => update('format', event.target.value)} required />
        <select className={cn('field', !form.mode && 'text-slate-400')} value={form.mode} onChange={(event) => update('mode', event.target.value)} required>
          <option value="" disabled hidden>Tournament mode</option>
          <option value="offline">Offline</option>
          <option value="online">Online</option>
        </select>
        <input className="field" type="text" placeholder="Tournament date" value={form.tournamentDate} onFocus={(event) => { event.target.type = 'date'; }} onBlur={(event) => { if (!event.target.value) event.target.type = 'text'; }} onChange={(event) => update('tournamentDate', event.target.value)} required />
        <input className="field" placeholder="City" value={form.location} onChange={(event) => update('location', event.target.value)} required />
        <input className="field md:col-span-2" placeholder="Venue details" value={form.venueDetails} onChange={(event) => update('venueDetails', event.target.value)} />
        <input className="field md:col-span-2" placeholder="Google Maps link" value={form.googleMapsLink} onChange={(event) => update('googleMapsLink', event.target.value)} />
        <input className="field" type="number" min="1" placeholder="Total slots" value={form.participantLimit} onChange={(event) => update('participantLimit', event.target.value)} required />
        <input className="field" type="text" placeholder="Registration close date" value={form.registrationEndDate} onFocus={(event) => { event.target.type = 'date'; }} onBlur={(event) => { if (!event.target.value) event.target.type = 'text'; }} onChange={(event) => update('registrationEndDate', event.target.value)} required />
        <input className="field" type="email" placeholder="Organizer mail ID" value={form.contactEmail} onChange={(event) => update('contactEmail', event.target.value)} required />
        <input className="field" placeholder="Organizer contact number" value={form.contactPhone} onChange={(event) => update('contactPhone', event.target.value)} required />
        <div className="md:col-span-2">
          <input className="field" type="file" accept="image/*" onChange={(event) => {
            const file = event.target.files?.[0];
            setBanner(file);
            if (file) setPreview(URL.createObjectURL(file));
          }} />
          {preview && <img className="mt-3 h-48 w-full rounded-2xl object-cover" src={preview} alt="" />}
        </div>
        <textarea className="field md:col-span-2 min-h-28" placeholder="Rules" value={form.rules} onChange={(event) => update('rules', event.target.value)} required />
        <textarea className="field md:col-span-2 min-h-24" placeholder="Description" value={form.description} onChange={(event) => update('description', event.target.value)} />
      </section>
      <button className="btn-primary">{editMode ? 'Update and resubmit' : 'Submit for approval'}</button>
    </form>
  );
}
