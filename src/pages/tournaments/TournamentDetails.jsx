import { Bookmark, CalendarDays, Flag, MapPin, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { tournamentService } from '../../services/tournamentService';

export default function TournamentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [registrationType, setRegistrationType] = useState('individual');
  const [teamName, setTeamName] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  useEffect(() => {
    tournamentService.detail(id).then(({ data }) => setTournament(data.tournament));
  }, [id]);

  const register = async () => {
    try {
      await tournamentService.register(id, { type: registrationType, teamName });
      toast.success('Registration submitted for organizer approval');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not register');
    }
  };

  const report = async () => {
    if (!reportReason.trim()) {
      toast.error('Please enter a reason for reporting');
      return;
    }

    try {
      await tournamentService.report(id, { reason: reportReason, details: reportDetails });
      toast.success('Report sent to admin review');
      setShowReportForm(false);
      setReportReason('');
      setReportDetails('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not report tournament');
    }
  };

  const save = async () => {
    try {
      const { data } = await tournamentService.save(id);
      toast.success(data.saved ? 'Tournament saved' : 'Tournament removed from saves');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update saved tournament');
    }
  };

  if (!tournament) return <Skeleton className="h-[520px]" />;

  const rules = (tournament.rules || '')
    .split(/\n|(?<=\.)\s+/)
    .map((rule) => rule.trim().replace(/\.$/, ''))
    .filter(Boolean);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <section className="glass-panel overflow-hidden rounded-3xl">
        <div className="h-72 bg-slate-200 dark:bg-slate-800">
          {tournament.bannerUrl ? <img src={tournament.bannerUrl} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center bg-[linear-gradient(135deg,_#0f172a,_#16a34a)] text-6xl font-black text-white">{tournament.sportType}</div>}
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone="green">{tournament.status?.replace('_', ' ')}</Badge>
            <Badge tone="blue">{tournament.mode}</Badge>
            <Badge>{tournament.format}</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight">{tournament.title}</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{tournament.description || 'Organizer has not added a description yet.'}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Info icon={CalendarDays} label="Tournament date" value={new Date(tournament.tournamentDate).toLocaleDateString()} />
            <Info icon={MapPin} label="Venue" value={tournament.mode === 'online' ? 'Online event' : tournament.venueDetails} />
            <Info icon={Users} label="Slots registered" value={`${tournament.approvedRegistrations || 0}/${tournament.participantLimit}`} />
            <Info icon={Flag} label="Registration closes" value={new Date(tournament.registrationEndDate).toLocaleDateString()} />
          </div>
          <div className="mt-6 rounded-2xl bg-slate-100 p-5 dark:bg-slate-950">
            <h2 className="font-black">Rules</h2>
            <ul className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              {rules.map((rule, index) => (
                <li key={`${rule}-${index}`} className="flex gap-2">
                  <span className="mt-0.5 font-black text-green-600 dark:text-green-300">›</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <aside className="space-y-4">
        <div className="glass-panel rounded-3xl p-5">
          <h2 className="text-xl font-black">Register</h2>
          <div className="mt-4 grid gap-3">
            <select className="field" value={registrationType} onChange={(event) => setRegistrationType(event.target.value)}>
              <option value="individual">Individual</option>
              <option value="team">Team captain</option>
            </select>
            {registrationType === 'team' && <input className="field" placeholder="Team name" value={teamName} onChange={(event) => setTeamName(event.target.value)} />}
            <button className="btn-primary" onClick={register} disabled={!user || user.role !== 'player'}>Submit registration</button>
            <button className="btn-secondary" onClick={save} disabled={!user || user.role !== 'player'}><Bookmark size={17} /> Save tournament</button>
            {!showReportForm ? (
              <button className="btn-secondary" onClick={() => setShowReportForm(true)} disabled={!user || user.role !== 'player'}>Report tournament</button>
            ) : (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-3 dark:border-red-950 dark:bg-red-950/20">
                <input className="field" placeholder="Reason for reporting" value={reportReason} onChange={(event) => setReportReason(event.target.value)} />
                <textarea className="field mt-3 min-h-24" placeholder="Add details for admin review" value={reportDetails} onChange={(event) => setReportDetails(event.target.value)} />
                <div className="mt-3 flex gap-2">
                  <button className="btn-primary flex-1" onClick={report}>Send report</button>
                  <button className="btn-secondary flex-1" onClick={() => setShowReportForm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-5">
          <h2 className="text-xl font-black">Organizer contact</h2>
          <p className="mt-2 text-sm text-slate-500">{tournament.organizerContact?.email}</p>
          <p className="text-sm text-slate-500">{tournament.organizerContact?.phone}</p>
          {tournament.googleMapsLink && <a className="mt-4 inline-flex font-bold text-green-700 dark:text-green-300" href={tournament.googleMapsLink} target="_blank" rel="noreferrer">Open map</a>}
        </div>
      </aside>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <Icon className="text-green-600 dark:text-green-300" size={20} />
      <p className="mt-3 text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}
