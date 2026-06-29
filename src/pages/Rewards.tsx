import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, Gift } from "lucide-react";
import api from "../api/axios";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import RewardCard from "../components/rewards/RewardCard";
import SuggestedRewardCard from "../components/rewards/SuggestedRewardCard";
import RewardModal from "../components/rewards/RewardModal";
import RewardSummaryCard from "../components/rewards/RewardSummaryCard";
import { suggestionRewards } from "../constants/rewardSuggestions";
import { rewardIconMap } from "../constants/rewardIcons";
import type { Reward, RewardPayload, RewardSummary, Suggestion } from "../types/reward";
import "../styles/Rewards.css";
import coinLogo from "../assets/coin_logo.png";
import giftLogo from "../assets/gift_logo.png";

function Rewards() {
  const [summary, setSummary] = useState<RewardSummary>({
    availableCoins: 0,
    rewardsUnlocked: 0,
  });
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(0);
  const [iconKey, setIconKey] = useState("gift");
  const [titleError, setTitleError] = useState("");
  const [costError, setCostError] = useState("");
  const [saving, setSaving] = useState(false);

  const canRedeem = useCallback(
    (reward: Reward) => summary.availableCoins >= reward.cost,
    [summary.availableCoins]
  );

  async function fetchRewardsData() {
    const [summaryRes, rewardsRes, userRes] = await Promise.all([
      api.get<RewardSummary>("/rewards/summary"),
      api.get<Reward[]>("/rewards"),
      api.get("/auth/me"),
    ]);

    return {
      summary: summaryRes.data,
      rewards: rewardsRes.data,
      dailyStreak: userRes.data.dailyStreak ?? 0,
      username: userRes.data.username,
    };
  }

  const loadRewards = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await fetchRewardsData();

      setSummary(data.summary);
      setRewards(data.rewards);
      setDailyStreak(data.dailyStreak);
      setUsername(data.username);
    } catch (err) {
      console.error("Failed to load rewards", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialRewards = async () => {
      setIsLoading(true);

      try {
        const data = await fetchRewardsData();

        if (!isMounted) {
          return;
        }

        setSummary(data.summary);
        setRewards(data.rewards);
        setDailyStreak(data.dailyStreak);
        setUsername(data.username);
      } catch (err) {
        console.error("Failed to load rewards", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchInitialRewards();

    return () => {
      isMounted = false;
    };
  }, []);

  function openCreateModal() {
    setEditingReward(null);
    setTitle("");
    setDescription("");
    setCost(0);
    setIconKey("gift");
    setTitleError("");
    setCostError("");
    setShowModal(true);
  }

  function openEditModal(reward: Reward) {
    setEditingReward(reward);
    setTitle(reward.title);
    setDescription(reward.description);
    setCost(reward.cost);
    setIconKey(reward.iconKey || "gift");
    setTitleError("");
    setCostError("");
    setShowModal(true);
  }

  async function handleSaveReward(payload: RewardPayload) {
    setTitleError("");
    setCostError("");

    if (!payload.title.trim()) {
      setTitleError("Title cannot be blank.");
    }

    if (payload.cost <= 0) {
      setCostError("Cost must be a positive value.");
    }

    if (!payload.title.trim() || payload.cost <= 0) {
      return;
    }

    setSaving(true);

    try {
      if (editingReward) {
        await api.put(`/rewards/${editingReward.id}`, payload);
      } else {
        await api.post("/rewards", payload);
      }

      setShowModal(false);
      await loadRewards();
    } catch (err) {
      console.error("Save reward failed", err);
    } finally {
      setSaving(false);
    }
  }

  const handleRedeemReward = useCallback(async (reward: Reward) => {
    if (!canRedeem(reward)) {
      return;
    }

    try {
      await api.post(`/rewards/${reward.id}/redeem`);
      await loadRewards();
    } catch (err) {
      console.error("Redeem reward failed", err);
    }
  }, [canRedeem, loadRewards]);

  const handleDeleteReward = useCallback(async (rewardId: number) => {
    try {
      await api.delete(`/rewards/${rewardId}`);
      await loadRewards();
    } catch (err) {
      console.error("Delete reward failed", err);
    }
  }, [loadRewards]);

  async function handleUseSuggestion(suggestion: Suggestion) {
    try {
      await api.post("/rewards", {
        title: suggestion.title,
        description: suggestion.description,
        cost: suggestion.cost,
        iconKey: suggestion.iconKey,
      });

      await loadRewards();
    } catch (err) {
      console.error("Create suggested reward failed", err);
    }
  }

  const rewardsSection = useMemo(() => {
    if (isLoading && rewards.length === 0) {
      return <div className="rewards-loading">Loading rewards…</div>;
    }

    if (rewards.length === 0) {
      return (
        <div className="rewards-empty-state card">
          <div className="rewards-empty-icon">
            <Gift size={34} />
          </div>
          <h3>No rewards yet</h3>
          <p>
            You haven't created any rewards. Add your first reward and start
            working towards something you love!
          </p>

          <button
            className="reward-empty-button"
            type="button"
            onClick={openCreateModal}
          >
            <span className="reward-empty-plus" aria-hidden="true" />
            Create Your First Reward
          </button>
        </div>
      );
    }

    return (
      <div className="reward-grid">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            availableCoins={summary.availableCoins}
            iconMap={rewardIconMap}
            onEdit={openEditModal}
            onDelete={handleDeleteReward}
            onRedeem={handleRedeemReward}
          />
        ))}
      </div>
    );
  }, [isLoading, rewards, summary.availableCoins, handleDeleteReward, handleRedeemReward]);

  return (
    <div className="app-shell">
      <Sidebar dailyStreak={dailyStreak} />

      <div className="rewards-page">
        <TopBar showLogout username={username} hideBrand />

        <main className="rewards-container">
          {/* <section className="rewards-hero">
            <div className="rewards-hero-content">
              <h1>Rewards</h1>
              <p>Create rewards and spend your coins on things you enjoy.</p>
            </div>
          </section> */}

          <section className="summary-grid">
            <RewardSummaryCard
              label="AVAILABLE COINS"
              value={summary.availableCoins}
              description="Keep earning!"
              Icon={Sparkles}
              imageSrc={coinLogo}
            />

            <RewardSummaryCard
              label="REWARDS UNLOCKED"
              value={summary.rewardsUnlocked}
              description="Start creating your rewards!"
              Icon={Gift}
              imageSrc={giftLogo}
              imageAlt="Gift"
            />
          </section>

          <section className="section-block rewards-collection-card">
            <div className="rewards-collection-header">
              <h2>My Rewards</h2>
              
              <button
                className="primary-button reward-create-button"
                type="button"
                onClick={openCreateModal}
              >
                + Add Reward
              </button>
            </div>

            {rewardsSection}
          </section>

          <section className="section-block suggested-rewards-card">
            <div className="suggested-rewards-header">
              <div className="suggested-rewards-title-row">
                <h2>Suggested Rewards</h2>
                <p>Need inspiration? Try these ideas to get started.</p>
              </div>

              <p className="suggested-rewards-note">
                Turn your coins into meaningful breaks and treats.
              </p>
            </div>

            <div className="suggestion-grid">
              {suggestionRewards.map((suggestion) => (
                <SuggestedRewardCard
                  key={suggestion.title}
                  suggestion={suggestion}
                  iconMap={rewardIconMap}
                  onUse={handleUseSuggestion}
                />
              ))}
            </div>
          </section>
        </main>

        {showModal &&
          createPortal(
            <RewardModal
              open={showModal}
              editingReward={editingReward}
              title={title}
              description={description}
              cost={cost}
              iconKey={iconKey}
              titleError={titleError}
              costError={costError}
              saving={saving}
              onClose={() => setShowModal(false)}
              onSubmit={handleSaveReward}
              onTitleChange={(value) => {
                setTitle(value);
                setTitleError("");
              }}
              onDescriptionChange={setDescription}
              onCostChange={(value) => {
                setCost(value);
                setCostError("");
              }}
              onIconKeyChange={setIconKey}
            />, 
            document.body
          )}
      </div>
    </div>
  );
}

export default Rewards;
