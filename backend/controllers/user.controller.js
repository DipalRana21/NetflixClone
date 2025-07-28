import User from "../models/User.js";


export const addToLikedMovies = async (req, res) => {

    try {
        const { email, data } = req.body;

        const user = await User.findOne({ email })

        if (user) {
            const { likedMovies } = user;
            const movieAlreadyLiked = likedMovies.find(({ id }) => (id === data.id));

            if (!movieAlreadyLiked) {
                await User.findByIdAndUpdate(
                    user._id,
                    {
                        likedMovies: [...user.likedMovies, data],
                    },
                    { new: true }
                );
            }

            else {
                return res.json({ msg: "Movie alraedy added to the list." })
            }
        }
        else {
            await User.create({ email, likedMovies: [data] })
        }

        return res.json({ msg: "Movie added successfully." })

    } catch (error) {
        return res.json({ msg: "Error adding movie to the list" })
    }
}

export const getLikedMovies = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });

        if (user) {
            return res.json({ msg: "sucess", movies: user.likedMovies })
        }
        else return res.json({ msg: "User with given email not found." })

    } catch (error) {
        return res.json({ msg: "error fetching movies." })
    }
}

export const removeFromLikedMovies = async (req, res) => {
    try {
        const { email, movieId } = req.body;

        const user = await User.findOne({ email })

        if (user) {
            const { likedMovies } = user;
            const movieIndex = likedMovies.findIndex(({ id }) => (id === movieId))

           if (movieIndex === -1) {
  return res.status(400).json({ msg: "Movie not found." });
}

            likedMovies.splice(movieIndex, 1);


            await User.findByIdAndUpdate(
                user._id,
                {
                    likedMovies,
                },
                { new: true }
            );

            return res.status(200).json({ msg: "Movie deleted successfully.", movies: likedMovies })

        }
        else {
            await User.create({ email, likedMovies: [data] })
        }




    } catch (error) {
        console.log(error);
        return res.json({ msg: "error deleting movie." })
    }
}