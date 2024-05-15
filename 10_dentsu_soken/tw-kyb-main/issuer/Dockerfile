FROM mcr.microsoft.com/devcontainers/java:1-8-bullseye

RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - && apt-get update -y && apt-get install google-cloud-cli -y
RUN wget https://mirrors.estointernet.in/apache/maven/maven-3/3.8.5/binaries/apache-maven-3.8.5-bin.tar.gz
RUN tar -xvf apache-maven-3.8.5-bin.tar.gz
RUN mv apache-maven-3.8.5 /opt/

RUN --mount=type=ssh,uid=1000 \
git clone https://github.com/authlete/java-oauth-server.git
RUN cp -rf /java-oauth-server/ /workspace
RUN rm -rf /java-oauth-server/

WORKDIR /workspace

RUN chown -R vscode:vscode /workspace

ENV M2_HOME='/opt/apache-maven-3.8.5'
ENV PATH="$M2_HOME/bin:$PATH"
RUN echo "export $PATH" >> ~/.bashrc
RUN echo "export PROMPT_DIRTRIM=2" >> ~/.bashrc
RUN echo 'export PS1="\w$ "' >> ~/.bashrc

RUN echo "set editing-mode emacs" >> ~/.inputrc
RUN echo "set completion-ignore-case off" >> ~/.inputrc
RUN echo "set show-all-if-unmodified on" >> ~/.inputrc
RUN echo '"\\C-p": history-search-backward' >> ~/.inputrc
RUN echo '"\\C-n": history-search-forward' >> ~/.inputrc
RUN echo '"\\e[A": history-search-backward' >> ~/.inputrc
RUN echo '"\\e[B": history-search-forward' >> ~/.inputrc